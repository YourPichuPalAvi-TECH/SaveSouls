import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, lessonsTable } from "@workspace/db";
import {
  ListLessonsParams,
  ListLessonsResponse,
  GetLessonParams,
  GetLessonResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/modules/:moduleId/lessons", async (req, res): Promise<void> => {
  const params = ListLessonsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.moduleId, params.data.moduleId))
    .orderBy(lessonsTable.order);

  res.json(ListLessonsResponse.parse(lessons));
});

router.get("/lessons/:lessonId", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
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

  res.json(GetLessonResponse.parse(lesson));
});

export default router;
