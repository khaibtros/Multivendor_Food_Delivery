import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  verifyShipperAccess,
  getShipperRestaurant,
} from "../controllers/shipper/ShipperController";

const router = express.Router();

// All routes require authentication
router.use(jwtCheck);
router.use(jwtParse);

// Get shipper's restaurant data
router.get("/restaurant", getShipperRestaurant);

// Verify shipper access for a specific restaurant
router.get("/verify/:restaurantId", verifyShipperAccess);

export default router; 