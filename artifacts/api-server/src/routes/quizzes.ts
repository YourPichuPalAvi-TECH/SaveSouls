import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, quizQuestionsTable, quizAttemptsTable } from "@workspace/db";
import {
  GetModuleQuizParams,
  GetModuleQuizResponse,
  SubmitQuizAttemptBody,
  SubmitQuizAttemptResponse,
  GetModuleAttemptsParams,
  GetModuleAttemptsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/modules/:moduleId/quiz", async (req, res): Promise<void> => {
  const params = GetModuleQuizParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.moduleId, params.data.moduleId))
    .orderBy(quizQuestionsTable.id);

  res.json(GetModuleQuizResponse.parse(questions));
});

router.post("/quiz-attempts", async (req, res): Promise<void> => {
  const parsed = SubmitQuizAttemptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { moduleId, score, totalQuestions, answers } = parsed.data;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;

  const [attempt] = await db
    .insert(quizAttemptsTable)
    .values({ moduleId, score, totalQuestions, percentage, passed, answers })
    .returning();

  res.status(201).json(SubmitQuizAttemptResponse.parse(attempt));
});

router.get("/quiz-attempts/module/:moduleId", async (req, res): Promise<void> => {
  const params = GetModuleAttemptsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const attempts = await db
    .select()
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.moduleId, params.data.moduleId))
    .orderBy(quizAttemptsTable.completedAt);

  res.json(GetModuleAttemptsResponse.parse(attempts));
});

export default router;
