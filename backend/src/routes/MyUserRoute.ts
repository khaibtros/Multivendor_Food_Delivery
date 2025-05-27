import express, { RequestHandler } from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();
// /api/my/user
router.get("/", jwtCheck, jwtParse as RequestHandler, MyUserController.getCurrentUser as RequestHandler);
router.post("/", jwtCheck, MyUserController.createCurrentUser as RequestHandler);
router.put(
  "/",
  jwtCheck,
  jwtParse as RequestHandler,
  validateMyUserRequest as RequestHandler[],
  MyUserController.updateCurrentUser as RequestHandler
);

export default router;