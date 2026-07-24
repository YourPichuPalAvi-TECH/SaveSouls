import { Router, type IRouter } from "express";
import healthRouter from "./health";
import modulesRouter from "./modules";
import lessonsRouter from "./lessons";
import quizzesRouter from "./quizzes";
import progressRouter from "./progress";

const router: IRouter = Router();

router.use(healthRouter);
router.use(modulesRouter);
router.use(lessonsRouter);
router.use(quizzesRouter);
router.use(progressRouter);

export default router;
