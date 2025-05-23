import express from "express";
import MyUserController from "../Controller/MyUserController";


const router = express.Router();

router.post("/", MyUserController.createCurrentUser);

export default router;