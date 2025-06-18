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
exports.getRestaurantCustomers = exports.getRestaurantOrders = exports.getRestaurantStats = exports.removeRestaurantShipper = exports.addRestaurantShipper = exports.getRestaurantShippers = exports.removeRestaurantSeller = exports.addRestaurantSeller = exports.getRestaurantSellers = exports.getManagerRestaurant = exports.verifyManagerAccess = void 0;
const user_1 = __importDefault(require("../../models/user"));
const restaurant_1 = __importDefault(require("../../models/restaurant"));
const order_1 = __importDefault(require("../../models/order"));
const verifyManagerAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (user.role !== "manager") {
            return res
                .status(403)
                .json({ message: "Access denied. Manager role required." });
        }
        // Verify if the manager owns this restaurant
        const restaurant = yield restaurant_1.default.findOne({
            _id: restaurantId,
            user: user._id,
        });
        if (!restaurant) {
            return res.status(403).json({ message: "Access denied to this restaurant" });
        }
        return res.status(200).json({ user, restaurant });
    }
    catch (error) {
        console.error("Error in verifyManagerAccess:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyManagerAccess = verifyManagerAccess;
const getManagerRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "manager") {
            return res
                .status(403)
                .json({ message: "Access denied. Manager role required." });
        }
        // Get the restaurant owned by this manager with all fields
        const restaurant = yield restaurant_1.default.findOne({ user: user._id })
            .select('-__v') // Exclude version field
            .lean(); // Convert to plain JavaScript object
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            },
            restaurant
        });
    }
    catch (error) {
        console.error("Error in getManagerRestaurant:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getManagerRestaurant = getManagerRestaurant;
const getRestaurantSellers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user || user.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: user._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Get all sellers associated with this restaurant
        const sellers = yield user_1.default.find({
            restaurant: restaurant._id,
            role: "seller"
        }).select('-__v');
        return res.status(200).json(sellers);
    }
    catch (error) {
        console.error("Error in getRestaurantSellers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantSellers = getRestaurantSellers;
const addRestaurantSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, restaurantId } = req.body;
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!email || !restaurantId) {
            return res.status(400).json({ message: "Email and restaurant ID are required" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied. Manager role required." });
        }
        // Check if restaurant exists and belongs to manager
        const restaurant = yield restaurant_1.default.findOne({
            _id: restaurantId,
            user: manager._id,
        });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // Find the user to be converted to seller
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. The user must login to the system first." });
        }
        // Only allow converting users with 'user' role to sellers
        if (user.role !== "user") {
            return res.status(403).json({
                message: "Cannot convert this user to seller. Only users with 'user' role can be converted to sellers."
            });
        }
        // Convert user to seller
        user.role = "seller";
        user.restaurant = restaurantId;
        yield user.save();
        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        console.error("Error in addRestaurantSeller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addRestaurantSeller = addRestaurantSeller;
const removeRestaurantSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        const { sellerId } = req.params;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: manager._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Find and remove the seller
        const seller = yield user_1.default.findOne({
            _id: sellerId,
            restaurant: restaurant._id,
            role: "seller",
        });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        // Remove seller's association with the restaurant
        seller.restaurant = undefined;
        seller.role = "user"; // Reset role to regular user
        yield seller.save();
        return res.status(200).json({ message: "Seller removed successfully" });
    }
    catch (error) {
        console.error("Error in removeRestaurantSeller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeRestaurantSeller = removeRestaurantSeller;
const getRestaurantShippers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user || user.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: user._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Get all shippers associated with this restaurant
        const shippers = yield user_1.default.find({
            restaurant: restaurant._id,
            role: "shipper"
        }).select('-__v');
        return res.status(200).json(shippers);
    }
    catch (error) {
        console.error("Error in getRestaurantShippers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantShippers = getRestaurantShippers;
const addRestaurantShipper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, restaurantId } = req.body;
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!email || !restaurantId) {
            return res.status(400).json({ message: "Email and restaurant ID are required" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied. Manager role required." });
        }
        // Check if restaurant exists and belongs to manager
        const restaurant = yield restaurant_1.default.findOne({
            _id: restaurantId,
            user: manager._id,
        });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // Find the user to be converted to shipper
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. The user must login to the system first." });
        }
        // Only allow converting users with 'user' role to shippers
        if (user.role !== "user") {
            return res.status(403).json({
                message: "Cannot convert this user to shipper. Only users with 'user' role can be converted to shippers."
            });
        }
        // Convert user to shipper
        user.role = "shipper";
        user.restaurant = restaurantId;
        yield user.save();
        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        console.error("Error in addRestaurantShipper:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addRestaurantShipper = addRestaurantShipper;
const removeRestaurantShipper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        const { shipperId } = req.params;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: manager._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Find and remove the shipper
        const shipper = yield user_1.default.findOne({
            _id: shipperId,
            restaurant: restaurant._id,
            role: "shipper",
        });
        if (!shipper) {
            return res.status(404).json({ message: "Shipper not found" });
        }
        // Remove shipper's association with the restaurant
        shipper.restaurant = undefined;
        shipper.role = "user"; // Reset role to regular user
        yield shipper.save();
        return res.status(200).json({ message: "Shipper removed successfully" });
    }
    catch (error) {
        console.error("Error in removeRestaurantShipper:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeRestaurantShipper = removeRestaurantShipper;
const getRestaurantStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: manager._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Get total revenue from paid and delivered orders
        const totalRevenue = yield order_1.default.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    paymentStatus: "paid",
                    status: "delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);
        // Get total number of unique customers who have completed orders
        const totalCustomers = yield order_1.default.aggregate([
            {
                $match: {
                    restaurant: restaurant._id,
                    paymentStatus: "paid",
                    status: "delivered"
                }
            },
            {
                $group: {
                    _id: "$user"
                }
            },
            {
                $count: "total"
            }
        ]);
        // Get total number of completed orders
        const totalOrders = yield order_1.default.countDocuments({
            restaurant: restaurant._id,
            paymentStatus: "paid",
            status: "delivered"
        });
        return res.status(200).json({
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            totalCustomers: ((_b = totalCustomers[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            totalOrders
        });
    }
    catch (error) {
        console.error("Error in getRestaurantStats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantStats = getRestaurantStats;
const getRestaurantOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: manager._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Get all orders for this restaurant with populated user details
        const orders = yield order_1.default.find({ restaurant: restaurant._id })
            .populate("user", "email name")
            .sort({ createdAt: -1 }) // Sort by newest first
            .select('-__v');
        return res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error in getRestaurantOrders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantOrders = getRestaurantOrders;
const getRestaurantCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth0Id = req.auth0Id;
        if (!auth0Id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const manager = yield user_1.default.findOne({ auth0Id });
        if (!manager || manager.role !== "manager") {
            return res.status(403).json({ message: "Access denied" });
        }
        // Get the restaurant owned by this manager
        const restaurant = yield restaurant_1.default.findOne({ user: manager._id });
        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for this manager" });
        }
        // Get all unique customers who have placed orders at this restaurant
        const customers = yield order_1.default.aggregate([
            {
                $match: {
                    restaurant: restaurant._id
                }
            },
            {
                $group: {
                    _id: "$user",
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$totalAmount" },
                    lastOrderDate: { $max: "$createdAt" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    email: "$userDetails.email",
                    name: "$userDetails.name",
                    totalOrders: 1,
                    totalSpent: 1,
                    lastOrderDate: 1
                }
            },
            {
                $sort: { lastOrderDate: -1 }
            }
        ]);
        return res.status(200).json(customers);
    }
    catch (error) {
        console.error("Error in getRestaurantCustomers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantCustomers = getRestaurantCustomers;
