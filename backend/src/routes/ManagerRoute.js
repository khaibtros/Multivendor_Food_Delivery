"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const ManagerController_1 = require("../controllers/manager/ManagerController");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.jwtCheck);
router.use(auth_1.jwtParse);
// Get manager's restaurant data
router.get("/restaurant", ManagerController_1.getManagerRestaurant);
// Verify manager access for a specific restaurant
router.get("/verify/:restaurantId", ManagerController_1.verifyManagerAccess);
// Restaurant statistics and data
router.get("/stats", ManagerController_1.getRestaurantStats);
router.get("/orders", ManagerController_1.getRestaurantOrders);
router.get("/customers", ManagerController_1.getRestaurantCustomers);
// Seller management routes
router.get("/sellers", ManagerController_1.getRestaurantSellers);
router.post("/sellers", ManagerController_1.addRestaurantSeller);
router.delete("/sellers/:sellerId", ManagerController_1.removeRestaurantSeller);
// Shipper management routes
router.get("/shippers", ManagerController_1.getRestaurantShippers);
router.post("/shippers", ManagerController_1.addRestaurantShipper);
router.delete("/shippers/:shipperId", ManagerController_1.removeRestaurantShipper);
exports.default = router;
