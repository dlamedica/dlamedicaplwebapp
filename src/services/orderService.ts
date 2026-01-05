import { db } from '../lib/apiClient';
import { Ebook } from '../types/ebook';
import * as gamificationService from './gamificationService';

export interface OrderItem {
  ebook_id: string;
  ebook_title: string;
  ebook_author: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address?: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  items: Array<{
    ebook: Ebook;
    quantity: number;
  }>;
  payment_method: string;
  discount_code?: string;
  discount_amount?: number;
  shipping_address?: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

/**
 * Tworzy nowe zamówienie w bazie danych
 */
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    // Pobierz aktualnego użytkownika
    const { data: { user }, error: userError } = await db.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Oblicz całkowitą kwotę
    const subtotal = orderData.items.reduce(
      (sum, item) => sum + item.ebook.price * item.quantity,
      0
    );
    const discountAmount = orderData.discount_amount || 0;
    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Utwórz zamówienie
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total_amount: totalAmount,
        subtotal_amount: subtotal,
        discount_code: orderData.discount_code || null,
        discount_amount: discountAmount,
        currency: 'PLN',
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        shipping_address: orderData.shipping_address || null,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Dodaj pozycje zamówienia
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      ebook_id: item.ebook.id,
      ebook_title: item.ebook.title,
      ebook_author: item.ebook.author,
      price: item.ebook.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await db
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Jeśli dodanie pozycji się nie powiodło, usuń zamówienie
      await db.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Dodaj zakupione ebooki do tabeli user_purchases
    const purchases = orderData.items.flatMap((item) =>
      Array.from({ length: item.quantity }, () => ({
        user_id: user.id,
        ebook_id: item.ebook.id,
        order_id: order.id,
        download_url: item.ebook.downloadUrl || null,
      }))
    );

    const { error: purchasesError } = await db
      .from('user_purchases')
      .insert(purchases);

    if (purchasesError) {
      console.error('Błąd podczas dodawania zakupów do user_purchases:', purchasesError);
      // Nie rzucamy błędu, ponieważ zamówienie już zostało utworzone
    }

    // Pobierz pełne zamówienie z pozycjami
    const fullOrder = await getOrderById(order.id);
    
    // UWAGA: Punkty będą przyznane dopiero po potwierdzeniu płatności
    // Zobacz funkcję confirmOrderPayment
    
    return fullOrder;
  } catch (error) {
    console.error('Błąd podczas tworzenia zamówienia:', error);
    throw error;
  }
};

/**
 * Pobiera zamówienie po ID
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const { data: order, error: orderError } = await db
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      throw orderError;
    }

    const { data: items, error: itemsError } = await db
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    return {
      ...order,
      items: items || [],
    } as Order;
  } catch (error) {
    console.error('Błąd podczas pobierania zamówienia:', error);
    throw error;
  }
};

/**
 * Pobiera wszystkie zamówienia użytkownika
 */
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const { data: { user }, error: userError } = await db.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data: orders, error: ordersError } = await db
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    // Pobierz pozycje dla każdego zamówienia
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items } = await db
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        return {
          ...order,
          items: items || [],
        } as Order;
      })
    );

    return ordersWithItems;
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień użytkownika:', error);
    throw error;
  }
};

/**
 * Aktualizuje status zamówienia
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  paymentStatus?: Order['payment_status']
): Promise<void> => {
  try {
    const updates: any = { status };
    if (paymentStatus) {
      updates.payment_status = paymentStatus;
    }

    const { error } = await db
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) {
      throw error;
    }

    // Jeśli płatność została potwierdzona, przyznaj punkty
    if (paymentStatus === 'paid' && status === 'completed') {
      await confirmOrderPayment(orderId);
    }
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu zamówienia:', error);
    throw error;
  }
};

/**
 * Potwierdza płatność zamówienia i przyznaje nagrody gamifikacyjne
 */
export const confirmOrderPayment = async (orderId: string): Promise<void> => {
  try {
    // Pobierz zamówienie
    const order = await getOrderById(orderId);

    if (order.payment_status !== 'paid' || order.status !== 'completed') {
      return; // Tylko dla opłaconych i zakończonych zamówień
    }

    // Sprawdź czy punkty już zostały przyznane (poprzez sprawdzenie historii punktów)
    const { data: existingPoints } = await db
      .from('points_history')
      .select('id')
      .eq('order_id', orderId)
      .eq('transaction_type', 'purchase')
      .limit(1);

    if (existingPoints && existingPoints.length > 0) {
      return; // Punkty już przyznane
    }

    // Przyznaj punkty za zakup
    await gamificationService.awardPointsForPurchase(
      order.user_id,
      orderId,
      order.total_amount
    );

    // Przyznaj kartę do zdrapywania po zakupie >50 PLN
    if (order.total_amount >= 50) {
      // Utwórz nagrodę - kartę do zdrapywania
      const { error: scratchCardError } = await db
        .from('game_rewards')
        .insert({
          user_id: order.user_id,
          game_type: 'scratch_card',
          reward_type: 'points', // Domyślnie punkty, ale może być też discount_code
          reward_value: JSON.stringify({
            type: 'scratch_card',
            order_amount: order.total_amount,
            unlocked_at: new Date().toISOString(),
          }),
          points_awarded: 0, // Będzie losowane przy zdrapywaniu
          is_claimed: false,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Ważna 30 dni
        });

      if (scratchCardError) {
        console.error('Błąd podczas tworzenia karty do zdrapywania:', scratchCardError);
      } else {
        console.log(`Karta do zdrapywania utworzona dla zamówienia ${orderId} (${order.total_amount} PLN)`);
      }
    }
  } catch (error) {
    console.error('Błąd podczas potwierdzania płatności i przyznawania nagród:', error);
    // Nie rzucamy błędu, żeby nie przerwać procesu zamówienia
  }
};

/**
 * Pobiera zakupione ebooki użytkownika
 */
export const getUserPurchases = async (): Promise<Array<{
  id: string;
  ebook_id: string;
  ebook_title: string;
  ebook_author: string;
  order_id: string;
  download_url: string | null;
  purchased_at: string;
}>> => {
  try {
    const { data: { user }, error: userError } = await db.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data: purchases, error: purchasesError } = await db
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (purchasesError) {
      throw purchasesError;
    }

    return purchases || [];
  } catch (error) {
    console.error('Błąd podczas pobierania zakupów użytkownika:', error);
    throw error;
  }
};

