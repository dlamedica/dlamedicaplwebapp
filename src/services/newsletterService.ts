/**
 * Serwis do zarządzania newsletterem i powiadomieniami email
 */

import { db } from '../lib/apiClient';

export interface NewsletterSubscription {
  id: string;
  user_id: string;
  email: string;
  subscribed: boolean;
  preferences: {
    promotions: boolean;
    new_products: boolean;
    price_drops: boolean;
    weekly_digest: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface EmailNotification {
  id: string;
  user_id: string;
  type: 'order_confirmation' | 'order_shipped' | 'order_delivered' | 'promotion' | 'price_drop' | 'new_product';
  subject: string;
  content: string;
  sent: boolean;
  sent_at?: string;
  created_at: string;
}

/**
 * Subskrybuje użytkownika do newslettera
 */
export const subscribeToNewsletter = async (
  email: string,
  preferences?: Partial<NewsletterSubscription['preferences']>
): Promise<NewsletterSubscription> => {
  try {
    const { data: { user } } = await db.auth.getUser();
    
    const defaultPreferences = {
      promotions: true,
      new_products: true,
      price_drops: false,
      weekly_digest: true,
      ...preferences,
    };

    const { data, error } = await db
      .from('newsletter_subscriptions')
      .upsert({
        user_id: user?.id || null,
        email,
        subscribed: true,
        preferences: defaultPreferences,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    throw new Error(error.message || 'Nie udało się zapisać do newslettera');
  }
};

/**
 * Anuluje subskrypcję newslettera
 */
export const unsubscribeFromNewsletter = async (email: string): Promise<void> => {
  try {
    const { error } = await db
      .from('newsletter_subscriptions')
      .update({ subscribed: false })
      .eq('email', email);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error);
    throw new Error(error.message || 'Nie udało się anulować subskrypcji');
  }
};

/**
 * Wysyła email potwierdzający zamówienie (symulacja)
 */
export const sendOrderConfirmationEmail = async (
  orderId: string,
  userEmail: string
): Promise<void> => {
  // Symulacja wysyłki email
  console.log(`📧 Email wysłany do ${userEmail}: Potwierdzenie zamówienia #${orderId}`);
  
  // W rzeczywistej aplikacji użyj serwisu email (np. SendGrid, Mailgun, Resend)
  // await emailService.send({
  //   to: userEmail,
  //   subject: `Potwierdzenie zamówienia #${orderId}`,
  //   template: 'order_confirmation',
  //   data: { orderId }
  // });
};

/**
 * Wysyła powiadomienie o promocji (symulacja)
 */
export const sendPromotionEmail = async (
  email: string,
  promotionData: { title: string; description: string; discountCode?: string }
): Promise<void> => {
  console.log(`📧 Email wysłany do ${email}: Promocja - ${promotionData.title}`);
};

/**
 * Wysyła powiadomienie o spadku ceny (symulacja)
 */
export const sendPriceDropEmail = async (
  email: string,
  productData: { title: string; oldPrice: number; newPrice: number }
): Promise<void> => {
  console.log(`📧 Email wysłany do ${email}: Spadek ceny - ${productData.title}`);
};

