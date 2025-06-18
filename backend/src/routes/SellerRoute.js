"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const SellerController_1 = require("../controllers/seller/SellerController");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.jwtCheck);
router.use(auth_1.jwtParse);
// Get seller's restaurant data
router.get("/restaurant", SellerController_1.getSellerRestaurant);
// Get seller's orders
router.get("/orders", SellerController_1.getSellerOrders);
// Update order status
router.patch("/order/:orderId/status", SellerController_1.updateOrderStatus);
exports.default = router;
