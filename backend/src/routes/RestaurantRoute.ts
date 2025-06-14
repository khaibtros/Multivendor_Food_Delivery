import express from "express";
import {
  getRestaurants,
  getPendingRestaurants,
  createRestaurant,
  approveRestaurant,
  rejectRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurant,
} from "../controllers/RestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// Public routes
router.get("/search/:city", searchRestaurant);
router.get("/", getRestaurants);
router.get("/:restaurantId", getRestaurantById);

// Protected routes (require authentication)
router.use(jwtCheck, jwtParse);

// Admin only routes
router.get("/admin/pending", checkRole("admin"), getPendingRestaurants);
router.post("/admin/:restaurantId/approve", checkRole("admin"), approveRestaurant);
router.post("/admin/:restaurantId/reject", checkRole("admin"), rejectRestaurant);

// Manager routes
router.post("/", createRestaurant);
router.put("/:restaurantId", updateRestaurant);
router.delete("/:restaurantId", deleteRestaurant);

export default router;
