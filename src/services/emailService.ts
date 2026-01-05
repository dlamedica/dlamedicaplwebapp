/**
 * Serwis do wysyłania powiadomień email (symulacja)
 * W rzeczywistej aplikacji użyj SendGrid, Mailgun, AWS SES, itp.
 */
export class EmailService {
  /**
   * Wysyła email powitalny
   */
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    // Symulacja - w rzeczywistości wywołaj API email service
    console.log(`📧 Welcome email sent to ${userEmail} for ${userName}`);
    
    // Przykład z SendGrid:
    // await sgMail.send({
    //   to: userEmail,
    //   from: 'noreply@dlamedica.pl',
    //   subject: 'Witamy w dLaMedica!',
    //   html: generateWelcomeEmailTemplate(userName),
    // });
  }

  /**
   * Wysyła email z potwierdzeniem zamówienia
   */
  static async sendOrderConfirmation(
    userEmail: string,
    orderId: string,
    orderTotal: number,
    items: Array<{ title: string; price: number; quantity: number }>
  ): Promise<void> {
    console.log(`📧 Order confirmation email sent to ${userEmail} for order ${orderId}`);
    console.log(`   Total: ${orderTotal} PLN, Items: ${items.length}`);
    
    // W rzeczywistości:
    // await sgMail.send({
    //   to: userEmail,
    //   from: 'orders@dlamedica.pl',
    //   subject: `Potwierdzenie zamówienia #${orderId}`,
    //   html: generateOrderConfirmationTemplate(orderId, orderTotal, items),
    // });
  }

  /**
   * Wysyła email z przypomnieniem o koszyku
   */
  static async sendCartReminder(
    userEmail: string,
    items: Array<{ title: string; price: number }>,
    total: number
  ): Promise<void> {
    console.log(`📧 Cart reminder email sent to ${userEmail}`);
    console.log(`   Items in cart: ${items.length}, Total: ${total} PLN`);
    
    // W rzeczywistości:
    // await sgMail.send({
    //   to: userEmail,
    //   from: 'noreply@dlamedica.pl',
    //   subject: 'Masz produkty w koszyku!',
    //   html: generateCartReminderTemplate(items, total),
    // });
  }

  /**
   * Wysyła email o promocji na produkty z wishlist
   */
  static async sendWishlistSaleNotification(
    userEmail: string,
    products: Array<{ title: string; oldPrice: number; newPrice: number; discount: number }>
  ): Promise<void> {
    console.log(`📧 Wishlist sale notification sent to ${userEmail}`);
    console.log(`   Products on sale: ${products.length}`);
    
    // W rzeczywistości:
    // await sgMail.send({
    //   to: userEmail,
    //   from: 'offers@dlamedica.pl',
    //   subject: '🔥 Promocja na produkty z Twojej listy życzeń!',
    //   html: generateWishlistSaleTemplate(products),
    // });
  }

  /**
   * Wysyła email z newsletterem
   */
  static async sendNewsletter(
    userEmail: string,
    newsletterContent: {
      title: string;
      featuredProducts: Array<{ id: string; title: string; price: number }>;
      articles: Array<{ title: string; excerpt: string }>;
    }
  ): Promise<void> {
    console.log(`📧 Newsletter sent to ${userEmail}`);
    console.log(`   Title: ${newsletterContent.title}`);
    
    // W rzeczywistości:
    // await sgMail.send({
    //   to: userEmail,
    //   from: 'newsletter@dlamedica.pl',
    //   subject: newsletterContent.title,
    //   html: generateNewsletterTemplate(newsletterContent),
    // });
  }

  /**
   * Wysyła email z fakturą
   */
  static async sendInvoice(
    userEmail: string,
    orderId: string,
    invoiceUrl: string
  ): Promise<void> {
    console.log(`📧 Invoice email sent to ${userEmail} for order ${orderId}`);
    
    // W rzeczywistości:
    // await sgMail.send({
    //   to: userEmail,
    //   from: 'invoices@dlamedica.pl',
    //   subject: `Faktura dla zamówienia #${orderId}`,
    //   html: generateInvoiceEmailTemplate(orderId, invoiceUrl),
    //   attachments: [{
    //     content: invoicePdfBase64,
    //     filename: `faktura-${orderId}.pdf`,
    //     type: 'application/pdf',
    //     disposition: 'attachment',
    //   }],
    // });
  }
}

