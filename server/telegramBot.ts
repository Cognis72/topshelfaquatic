import TelegramBot from 'node-telegram-bot-api';
import { Order, OrderItem } from '../shared/schema';

export class TelegramNotificationService {
  private bot: TelegramBot | null = null;
  private chatId: string | null = null;
  private isEnabled: boolean = false;

  constructor() {
    this.initBot();
  }

  private initBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.log('Telegram bot not configured - notifications disabled');
      console.log('Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: false });
      this.chatId = chatId;
      this.isEnabled = true;
      console.log('Telegram bot initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
      this.isEnabled = false;
    }
  }

  async sendOrderNotification(order: Order, orderItems: OrderItem[]) {
    if (!this.isEnabled || !this.bot || !this.chatId) {
      console.log('Telegram notifications not configured - skipping notification');
      return;
    }

    try {
      let message = `🐟 **คำสั่งซื้อใหม่ - TopShelf Aquatic**\n\n`;
      message += `📋 **หมายเลขคำสั่งซื้อ:** ${order.id}\n`;
      message += `👤 **ชื่อลูกค้า:** ${order.customerName}\n`;
      message += `📱 **เบอร์โทร:** ${order.customerPhone}\n`;
      message += `📧 **อีเมล:** ${order.customerEmail || 'ไม่ระบุ'}\n`;
      message += `🏠 **ที่อยู่:** ${order.customerAddress}\n\n`;

      message += `🐠 **รายการสินค้า:**\n`;
      for (const item of orderItems) {
        message += `• จำนวน ${item.quantity} ตัว - ราคา ${item.price} บาท\n`;
      }

      message += `\n💰 **ยอดรวม:** ${order.totalAmount} บาท\n`;
      message += `📝 **หมายเหตุ:** ${order.notes || 'ไม่มี'}\n`;
      message += `📅 **วันที่สั่งซื้อ:** ${order.createdAt ? new Date(order.createdAt).toLocaleString('th-TH') : 'ไม่ระบุ'}\n`;
      message += `🔄 **สถานะ:** ${this.getStatusText(order.status || 'pending')}\n`;

      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });

      console.log(`Telegram notification sent for order ${order.id}`);
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  }

  async sendOrderStatusUpdate(order: Order, newStatus: string, oldStatus: string) {
    if (!this.isEnabled || !this.bot || !this.chatId) {
      return;
    }

    try {
      const message = `🔄 **อัพเดทสถานะคำสั่งซื้อ**\n\n` +
        `📋 **หมายเลขคำสั่งซื้อ:** ${order.id}\n` +
        `👤 **ลูกค้า:** ${order.customerName}\n` +
        `📱 **เบอร์โทร:** ${order.customerPhone}\n` +
        `📊 **สถานะเก่า:** ${this.getStatusText(oldStatus)}\n` +
        `📊 **สถานะใหม่:** ${this.getStatusText(newStatus)}\n` +
        `📅 **เวลาอัพเดท:** ${new Date().toLocaleString('th-TH')}`;

      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });

      console.log(`Status update notification sent for order ${order.id}`);
    } catch (error) {
      console.error('Failed to send status update notification:', error);
    }
  }

  private getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': '⏳ รอดำเนินการ',
      'confirmed': '✅ ยืนยันคำสั่งซื้อ',
      'processing': '🔄 กำลังจัดเตรียม',
      'shipped': '📦 จัดส่งแล้ว',
      'delivered': '🎉 ส่งมอบสำเร็จ',
      'cancelled': '❌ ยกเลิก'
    };
    return statusMap[status] || status;
  }

  async testConnection() {
    if (!this.isEnabled || !this.bot || !this.chatId) {
      return false;
    }

    try {
      await this.bot.sendMessage(this.chatId, 'Telegram bot test - TopShelf Aquatic');
      return true;
    } catch (error) {
      console.error('Telegram bot test failed:', error);
      return false;
    }
  }
}

export const telegramService = new TelegramNotificationService();