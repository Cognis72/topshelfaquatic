import {
  users,
  fishes,
  orders,
  orderItems,
  type User,
  type UpsertUser,
  type Fish,
  type InsertFish,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Fish operations
  getAllFishes(): Promise<Fish[]>;
  getFish(id: number): Promise<Fish | undefined>;
  createFish(fish: InsertFish): Promise<Fish>;
  updateFish(id: number, fish: Partial<InsertFish>): Promise<Fish>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersForUser(userId: string): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Fish operations
  async getAllFishes(): Promise<Fish[]> {
    return await db.select().from(fishes).orderBy(fishes.id);
  }

  async getFish(id: number): Promise<Fish | undefined> {
    const [fish] = await db.select().from(fishes).where(eq(fishes.id, id));
    return fish;
  }

  async createFish(fishData: InsertFish): Promise<Fish> {
    const [fish] = await db.insert(fishes).values(fishData).returning();
    return fish;
  }

  async updateFish(id: number, fishData: Partial<InsertFish>): Promise<Fish> {
    const [fish] = await db
      .update(fishes)
      .set({ ...fishData, updatedAt: new Date() })
      .where(eq(fishes.id, id))
      .returning();
    return fish;
  }

  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async addOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(orderItemData).returning();
    return orderItem;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersForUser(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }
}

export const storage = new DatabaseStorage();