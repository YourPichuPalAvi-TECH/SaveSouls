import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, modulesTable } from "@workspace/db";
import {
  GetModuleParams,
  GetModuleResponse,
  ListModulesResponse,
  GetFeaturedModulesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/modules", async (_req, res): Promise<void> => {
  const modules = await db.select().from(modulesTable).orderBy(modulesTable.id);
  res.json(ListModulesResponse.parse(modules));
});

router.get("/modules/featured", async (_req, res): Promise<void> => {
  const modules = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.isFeatured, true))
    .orderBy(modulesTable.id);
  res.json(GetFeaturedModulesResponse.parse(modules));
});

router.get("/modules/:moduleId", async (req, res): Promise<void> => {
  const params = GetModuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [module] = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.id, params.data.moduleId));

  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  res.json(GetModuleResponse.parse(module));
});

export default router;
