import { pgTable, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { lessonsTable } from "./lessons";
import { modulesTable } from "./modules";

export const lessonProgressTable = pgTable("lesson_progress", {
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  moduleId: integer("module_id").notNull().references(() => modulesTable.id),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.lessonId] }),
]);

export type LessonProgress = typeof lessonProgressTable.$inferSelect;
