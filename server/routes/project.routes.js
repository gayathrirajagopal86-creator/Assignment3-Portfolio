import express from "express";
import projectCtrl from "../controllers/project.controller.js";
import { requireSignin, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin: Create
router.post("/project", requireSignin, isAdmin, projectCtrl.create);

// Everyone: Read
router.get("/project", projectCtrl.list);

// Admin: Read single project
router.get("/project/:id", projectCtrl.read);

// Admin: Update
router.put("/project/:id", requireSignin, isAdmin, projectCtrl.update);

// Admin: Delete
router.delete("/project/:id", requireSignin, isAdmin, projectCtrl.remove);

// Admin: Delete all
router.delete("/project", requireSignin, isAdmin, projectCtrl.removeAll);

export default router;
