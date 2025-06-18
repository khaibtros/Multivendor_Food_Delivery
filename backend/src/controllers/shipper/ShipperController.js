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
exports.updateOrderStatus = exports.getShipperOrders = exports.getShipperRestaurant = exports.verifyShipperAccess = void 0;
const user_1 = __importDefault(require("../../models/user"));
const restaurant_1 = __importDefault(require("../../models/restaurant"));
const order_1 = __importDefault(require("../../models/order"));
const verifyShipperAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const auth0Id = req.auth0Id;
        const restaurantId = req.params.restaurantId;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "shipper") {
            return res
                .status(403)
                .json({ message: "Access denied. Shipper role required." });
        }
        // Verify if the shipper is associated with this restaurant
        if (((_a = user.restaurant) === null || _a === void 0 ? void 0 : _a.toString()) !== restaurantId) {
            return res.status(403).json({ message: "Access denied to this restaurant" });
        }
        const restaurant = yield restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        return res.status(200).json({ user, restaurant });
    }
    catch (error) {
        console.error("Error in verifyShipperAccess:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyShipperAccess = verifyShipperAccess;
const getShipperRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "shipper") {
            return res
                .status(403)
                .json({ message: "Access denied. Shipper role required." });
        }
        if (!user.restaurant) {
            return res.status(404).json({ message: "No restaurant associated with this shipper" });
        }
        // Get the restaurant associated with this shipper
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
                name: user.name,
                role: user.role
            },
            restaurant
        });
    }
    catch (error) {
        console.error("Error in getShipperRestaurant:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getShipperRestaurant = getShipperRestaurant;
const getShipperOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        const { status } = req.query;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "shipper") {
            return res.status(403).json({ message: "Access denied. Shipper role required." });
        }
        if (!user.restaurant) {
            return res.status(404).json({ message: "No restaurant associated with this shipper" });
        }
        // Build query
        const query = {
            restaurant: user.restaurant,
            shipper: user._id
        };
        // Add status filter if provided
        if (status) {
            query.status = status;
        }
        // Get orders
        const orders = yield order_1.default.find(query)
            .populate("restaurant", "restaurantName addressLine1 city")
            .populate("user", "email name")
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error in getShipperOrders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getShipperOrders = getShipperOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "shipper") {
            return res.status(403).json({ message: "Access denied. Shipper role required." });
        }
        // Find the order
        const order = yield order_1.default.findOne({
            _id: orderId,
            shipper: user._id,
            restaurant: user.restaurant,
            status: "outForDelivery"
        });
        if (!order) {
            return res.status(404).json({
                message: "Order not found, not assigned to you, or not in outForDelivery status"
            });
        }
        // Validate status transition
        if (status !== "delivered") {
            return res.status(400).json({
                message: "Invalid status transition. Can only mark orders as delivered"
            });
        }
        // Update order status
        order.status = status;
        // If it's a COD order, mark payment as paid
        if (order.paymentMethod === "cod") {
            order.paymentStatus = "paid";
        }
        yield order.save();
        return res.status(200).json({
            message: "Delivery confirmed successfully" +
                (order.paymentMethod === "cod" ? " and payment received" : ""),
            order
        });
    }
    catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
