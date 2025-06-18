"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const ShipperController_1 = require("../controllers/shipper/ShipperController");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.jwtCheck);
router.use(auth_1.jwtParse);
// Get shipper's restaurant data
router.get("/restaurant", ShipperController_1.getShipperRestaurant);
// Verify shipper access for a specific restaurant
router.get("/verify/:restaurantId", ShipperController_1.verifyShipperAccess);
// Get shipper's orders
router.get("/orders", ShipperController_1.getShipperOrders);
// Update order status (includes delivery confirmation)
router.patch("/order/:orderId/status", ShipperController_1.updateOrderStatus);
exports.default = router;
