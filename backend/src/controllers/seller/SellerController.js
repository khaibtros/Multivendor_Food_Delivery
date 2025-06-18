"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getSellerOrders = exports.getSellerRestaurant = void 0;
const user_1 = __importDefault(require("../../models/user"));
const restaurant_1 = __importDefault(require("../../models/restaurant"));
const order_1 = __importDefault(require("../../models/order"));
const getSellerRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "seller") {
            return res
                .status(403)
                .json({ message: "Access denied. Seller role required." });
        }
        if (!user.restaurant) {
            return res.status(404).json({ message: "No restaurant associated with this seller" });
        }
        // Get the restaurant associated with this seller
        const restaurant = yield restaurant_1.default.findById(user.restaurant)
            .select('-__v') // Exclude version field
            .lean(); // Convert to plain JavaScript object
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                auth0Id: user.auth0Id
            },
            restaurant
        });
    }
    catch (error) {
        console.error("Error in getSellerRestaurant:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSellerRestaurant = getSellerRestaurant;
const getSellerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "seller") {
            return res
                .status(403)
                .json({ message: "Access denied. Seller role required." });
        }
        if (!user.restaurant) {
            return res.status(404).json({ message: "No restaurant associated with this seller" });
        }
        // Get all orders for this restaurant
        const orders = yield order_1.default.find({ restaurant: user.restaurant })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate("user", "email name") // Include user details
            .lean(); // Convert to plain JavaScript object
        return res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error in getSellerOrders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getSellerOrders = getSellerOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.userId;
        // Get user to check role
        const user = yield user_1.default.findById(userId);
        if (!user || user.role !== "seller") {
            return res.status(403).json({ message: "Only sellers can update order status" });
        }
        const order = yield order_1.default.findOne({
            _id: orderId,
            restaurant: user.restaurant
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Validate status transitions for sellers
        const validTransitions = {
            pending: ["confirmed", "inProgress"],
            confirmed: ["inProgress"],
            inProgress: ["outForDelivery"]
        };
        if (!((_a = validTransitions[order.status]) === null || _a === void 0 ? void 0 : _a.includes(status))) {
            return res.status(400).json({ message: "Invalid status transition" });
        }
        order.status = status;
        yield order.save();
        res.json({ message: "Order status updated successfully", order });
    }
    catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Error updating order status" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
