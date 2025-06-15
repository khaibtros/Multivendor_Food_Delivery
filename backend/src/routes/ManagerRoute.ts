import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  verifyManagerAccess,
  getManagerRestaurant,
  getRestaurantSellers,
  addRestaurantSeller,
  removeRestaurantSeller,
  getRestaurantShippers,
  addRestaurantShipper,
  removeRestaurantShipper,
  getRestaurantStats,
  getRestaurantOrders,
  getRestaurantCustomers,
} from "../controllers/manager/ManagerController";

const router = express.Router();

// All routes require authentication
router.use(jwtCheck);
router.use(jwtParse);

// Get manager's restaurant data
router.get("/restaurant", getManagerRestaurant);

// Verify manager access for a specific restaurant
router.get("/verify/:restaurantId", verifyManagerAccess);

// Restaurant statistics and data
router.get("/stats", getRestaurantStats);
router.get("/orders", getRestaurantOrders);
router.get("/customers", getRestaurantCustomers);

// Seller management routes
router.get("/sellers", getRestaurantSellers);
router.post("/sellers", addRestaurantSeller);
router.delete("/sellers/:sellerId", removeRestaurantSeller);

// Shipper management routes
router.get("/shippers", getRestaurantShippers);
router.post("/shippers", addRestaurantShipper);
router.delete("/shippers/:shipperId", removeRestaurantShipper);

export default router; 