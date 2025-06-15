import express from "express";
import AdminController from "../controllers/admin/AdminController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/verify", jwtCheck, jwtParse, AdminController.verifyAdminAccess);

export default router; 