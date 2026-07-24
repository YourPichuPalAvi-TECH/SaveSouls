import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  iconName: text("icon_name").notNull().default("Heart"),
  totalLessons: integer("total_lessons").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  section: text("section").notNull().default("civilian"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modulesTable).omit({ id: true, createdAt: true });
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modulesTable.$inferSelect;
