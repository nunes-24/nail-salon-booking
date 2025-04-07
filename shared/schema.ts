import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Client schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  lastVisit: timestamp("last_visit"),
  totalSpent: doublePrecision("total_spent").default(0),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  email: true,
  phone: true,
});

// Services categories schema
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).pick({
  name: true,
  image: true,
});

// Services schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
  image: text("image").notNull(),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  categoryId: true,
  name: true,
  price: true,
  duration: true,
  image: true,
});

// Appointments schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  serviceId: integer("service_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, canceled
  notes: text("notes"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  clientId: true,
  serviceId: true,
  date: true,
  notes: true,
});

// Availability schema (for blocked times/days)
export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const insertAvailabilitySchema = createInsertSchema(availability).pick({
  date: true,
  isAvailable: true,
});

// Message templates schema
export const messageTemplates = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // confirmation, cancellation, etc.
  subject: text("subject").notNull(),
  body: text("body").notNull(),
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).pick({
  type: true,
  subject: true,
  body: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;

export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;
