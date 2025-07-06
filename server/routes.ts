import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramService } from "./telegramBot";
import type { OrderItem } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fish API routes
  app.get('/api/fishes', async (req: any, res: any) => {
    try {
      const fishes = await storage.getAllFishes();
      res.json(fishes);
    } catch (error) {
      console.error("Error fetching fishes:", error);
      res.status(500).json({ message: "Failed to fetch fishes" });
    }
  });

  app.get('/api/fishes/:id', async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id);
      const fish = await storage.getFish(id);
      if (!fish) {
        return res.status(404).json({ message: "Fish not found" });
      }
      res.json(fish);
    } catch (error) {
      console.error("Error fetching fish:", error);
      res.status(500).json({ message: "Failed to fetch fish" });
    }
  });

  // Order API routes
  app.post('/api/orders', async (req: any, res: any) => {
    try {
      const { customerName, customerEmail, customerPhone, customerAddress, orderItems, notes } = req.body;
      
      if (!customerName || !customerPhone || !customerAddress || !orderItems || !Array.isArray(orderItems)) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of orderItems) {
        const fish = await storage.getFish(item.fishId);
        if (!fish) {
          return res.status(400).json({ message: `Fish with ID ${item.fishId} not found` });
        }
        totalAmount += parseFloat(fish.price) * item.quantity;
      }

      // Create order
      const order = await storage.createOrder({
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        totalAmount: totalAmount.toString(),
        notes,
        status: 'pending',
      });

      // Add order items
      const createdOrderItems: OrderItem[] = [];
      for (const item of orderItems) {
        const fish = await storage.getFish(item.fishId);
        const orderItem = await storage.addOrderItem({
          orderId: order.id,
          fishId: item.fishId,
          quantity: item.quantity,
          price: fish!.price,
        });
        createdOrderItems.push(orderItem);
      }

      // Send Telegram notification for new order
      await telegramService.sendOrderNotification(order, createdOrderItems);

      res.status(201).json({ message: "Order created successfully", orderId: order.id });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', async (req: any, res: any) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch('/api/orders/:id/status', async (req: any, res: any) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const oldStatus = req.body.oldStatus;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(id, status);
      
      // Send Telegram notification for status update
      if (oldStatus && oldStatus !== status) {
        await telegramService.sendOrderStatusUpdate(order, status, oldStatus);
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}