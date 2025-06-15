import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  getSellerRestaurant,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/seller/SellerController";

const router = express.Router();

// All routes require authentication
router.use(jwtCheck);
router.use(jwtParse);

// Get seller's restaurant data
router.get("/restaurant", getSellerRestaurant);

// Get seller's orders
router.get("/orders", getSellerOrders);

// Update order status
router.patch("/order/:orderId/status", updateOrderStatus);

export default router;