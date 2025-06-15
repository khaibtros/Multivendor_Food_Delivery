import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  verifyShipperAccess,
  getShipperRestaurant,
  getShipperOrders,
  updateOrderStatus,
} from "../controllers/shipper/ShipperController";

const router = express.Router();

// All routes require authentication
router.use(jwtCheck);
router.use(jwtParse);

// Get shipper's restaurant data
router.get("/restaurant", getShipperRestaurant);

// Verify shipper access for a specific restaurant
router.get("/verify/:restaurantId", verifyShipperAccess);

// Get shipper's orders
router.get("/orders", getShipperOrders);

// Update order status (includes delivery confirmation)
router.patch("/order/:orderId/status", updateOrderStatus);

export default router; 