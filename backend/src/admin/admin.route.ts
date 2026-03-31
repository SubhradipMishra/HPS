import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAll);
router.post("/", AdminController.create);

export default router;
