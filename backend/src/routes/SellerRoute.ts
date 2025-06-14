import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  verifySellerAccess,
  getSellerRestaurant,
} from "../controllers/seller/SellerController";

const router = express.Router();

// All routes require authentication
router.use(jwtCheck);
router.use(jwtParse);

// Get seller's restaurant data
router.get("/restaurant", getSellerRestaurant);

// Verify seller access for a specific restaurant
router.get("/verify/:restaurantId", verifySellerAccess);


export default router; 