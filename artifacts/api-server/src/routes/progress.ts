import { Router, type IRouter } from "express";
import { db, lessonProgressTable, quizAttemptsTable, modulesTable, lessonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  MarkLessonCompleteParams,
  MarkLessonCompleteResponse,
  GetProgressResponse,
  GetProgressSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/progress", async (_req, res): Promise<void> => {
  const progress = await db.select().from(lessonProgressTable);
  res.json(GetProgressResponse.parse(progress));
});

router.get("/progress/summary", async (_req, res): Promise<void> => {
  const [allModules, allLessons, progress, allAttempts] = await Promise.all([
    db.select().from(modulesTable),
    db.select().from(lessonsTable),
    db.select().from(lessonProgressTable),
    db.select().from(quizAttemptsTable),
  ]);

  const completedLessonIds = new Set(progress.map((p) => p.lessonId));
  const completedLessons = completedLessonIds.size;

  // A module is "complete" if all its lessons are completed
  const lessonsByModule = new Map<number, number[]>();
  for (const lesson of allLessons) {
    if (!lessonsByModule.has(lesson.moduleId)) lessonsByModule.set(lesson.moduleId, []);
    lessonsByModule.get(lesson.moduleId)!.push(lesson.id);
  }

  let completedModules = 0;
  for (const [, lessonIds] of lessonsByModule) {
    if (lessonIds.length > 0 && lessonIds.every((id) => completedLessonIds.has(id))) {
      completedModules++;
    }
  }

  const passedAttempts = allAttempts.filter((a) => a.passed);
  const averageQuizScore =
    passedAttempts.length > 0
      ? Math.round(passedAttempts.reduce((sum, a) => sum + a.percentage, 0) / passedAttempts.length)
      : null;

  // Streak: count consecutive days with at least one completion (simplified)
  const streakDays = progress.length > 0 ? 1 : 0;

  const summary = {
    totalModules: allModules.length,
    completedModules,
    totalLessons: allLessons.length,
    completedLessons,
    averageQuizScore,
    quizzesTaken: allAttempts.length,
    streakDays,
  };

  res.json(GetProgressSummaryResponse.parse(summary));
});

router.post("/progress/lessons/:lessonId", async (req, res): Promise<void> => {
  const params = MarkLessonCompleteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.lessonId));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  // Upsert: insert or ignore if already completed
  const existing = await db
    .select()
    .from(lessonProgressTable)
    .where(eq(lessonProgressTable.lessonId, params.data.lessonId));

  if (existing.length > 0) {
    res.json(MarkLessonCompleteResponse.parse(existing[0]));
    return;
  }

  const [record] = await db
    .insert(lessonProgressTable)
    .values({ lessonId: lesson.id, moduleId: lesson.moduleId })
    .returning();

  res.json(MarkLessonCompleteResponse.parse(record));
});

export default router;
