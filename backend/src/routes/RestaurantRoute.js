"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RestaurantController_1 = require("../controllers/RestaurantController");
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const router = express_1.default.Router();
// Public routes
router.get("/search/:city", RestaurantController_1.searchRestaurant);
router.get("/", RestaurantController_1.getRestaurants);
router.get("/:restaurantId", RestaurantController_1.getRestaurantById);
// Protected routes (require authentication)
router.use(auth_1.jwtCheck, auth_1.jwtParse);
// Admin only routes
router.get("/admin/pending", (0, checkRole_1.checkRole)("admin"), RestaurantController_1.getPendingRestaurants);
router.post("/admin/:restaurantId/approve", (0, checkRole_1.checkRole)("admin"), RestaurantController_1.approveRestaurant);
router.post("/admin/:restaurantId/reject", (0, checkRole_1.checkRole)("admin"), RestaurantController_1.rejectRestaurant);
// Manager routes
router.post("/", RestaurantController_1.createRestaurant);
router.put("/:restaurantId", RestaurantController_1.updateRestaurant);
router.delete("/:restaurantId", RestaurantController_1.deleteRestaurant);
exports.default = router;
