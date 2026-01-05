/**
 * Serwis do generowania faktur PDF
 */

import { Order } from './orderService';

export interface InvoiceData {
  invoiceNumber: string;
  order: Order;
  issueDate: string;
  dueDate: string;
  seller: {
    name: string;
    address: string;
    nip: string;
    email: string;
    phone: string;
  };
  buyer: {
    name: string;
    email: string;
    address?: string;
    nip?: string;
  };
}

/**
 * Generuje numer faktury
 */
export const generateInvoiceNumber = (orderId: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const orderNum = orderId.substring(0, 8).toUpperCase();
  return `FV/${year}/${month}/${orderNum}`;
};

/**
 * Generuje dane faktury
 */
export const generateInvoiceData = (order: Order): InvoiceData => {
  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 dni

  return {
    invoiceNumber: generateInvoiceNumber(order.id),
    order,
    issueDate,
    dueDate,
    seller: {
      name: 'DlaMedica.pl',
      address: 'ul. Przykładowa 123, 00-000 Warszawa',
      nip: '1234567890',
      email: 'faktury@dlamedica.pl',
      phone: '+48 123 456 789',
    },
    buyer: {
      name: order.shipping_address?.full_name || 'Klient',
      email: order.shipping_address?.email || '',
      address: order.shipping_address?.address
        ? `${order.shipping_address.address}, ${order.shipping_address.postal_code} ${order.shipping_address.city}`
        : undefined,
    },
  };
};

/**
 * Generuje PDF faktury (symulacja - w rzeczywistej aplikacji użyj biblioteki jak jsPDF)
 */
export const generateInvoicePDF = async (invoiceData: InvoiceData): Promise<Blob> => {
  // Symulacja generowania PDF
  // W rzeczywistej aplikacji użyj biblioteki jak jsPDF lub html2pdf
  const html = generateInvoiceHTML(invoiceData);
  
  // Symulacja - zwróć blob z HTML (w rzeczywistości byłby to PDF)
  return new Blob([html], { type: 'text/html' });
};

/**
 * Generuje HTML faktury (do konwersji na PDF)
 */
const generateInvoiceHTML = (data: InvoiceData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Faktura ${data.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .invoice-number { font-size: 24px; font-weight: bold; }
        .section { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
        .total { text-align: right; font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>${data.seller.name}</h1>
          <p>${data.seller.address}</p>
          <p>NIP: ${data.seller.nip}</p>
        </div>
        <div>
          <div class="invoice-number">Faktura ${data.invoiceNumber}</div>
          <p>Data wystawienia: ${data.issueDate}</p>
          <p>Termin płatności: ${data.dueDate}</p>
        </div>
      </div>
      
      <div class="section">
        <h2>Nabywca:</h2>
        <p><strong>${data.buyer.name}</strong></p>
        <p>${data.buyer.email}</p>
        ${data.buyer.address ? `<p>${data.buyer.address}</p>` : ''}
      </div>
      
      <div class="section">
        <h2>Pozycje faktury:</h2>
        <table>
          <thead>
            <tr>
              <th>Lp.</th>
              <th>Nazwa</th>
              <th>Ilość</th>
              <th>Cena jednostkowa</th>
              <th>Wartość</th>
            </tr>
          </thead>
          <tbody>
            ${data.order.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.ebook_title}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} PLN</td>
                <td>${(item.price * item.quantity).toFixed(2)} PLN</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section total">
        <p>Razem: ${data.order.total_amount.toFixed(2)} PLN</p>
        <p>VAT (23%): ${(data.order.total_amount * 0.23).toFixed(2)} PLN</p>
        <p>Do zapłaty: ${data.order.total_amount.toFixed(2)} PLN</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Pobiera fakturę dla zamówienia
 */
export const getInvoiceForOrder = async (orderId: string): Promise<InvoiceData | null> => {
  // W rzeczywistej aplikacji pobierz zamówienie z bazy danych
  // Na razie zwracamy null - to będzie zaimplementowane z orderService
  return null;
};

