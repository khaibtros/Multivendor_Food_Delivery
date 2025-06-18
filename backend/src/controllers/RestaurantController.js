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
exports.deleteRestaurant = exports.updateRestaurant = exports.getRestaurantById = exports.rejectRestaurant = exports.approveRestaurant = exports.createRestaurant = exports.getPendingRestaurants = exports.getRestaurants = exports.searchRestaurant = exports.getRestaurant = void 0;
const restaurant_1 = __importDefault(require("../models/restaurant"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "restaurant not found" });
        }
        res.json(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.getRestaurant = getRestaurant;
const searchRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = req.params.city;
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = req.query.selectedCuisines || "";
        const sortOption = req.query.sortOption || "lastUpdated";
        const page = parseInt(req.query.page) || 1;
        let query = {
            status: "approved" // Only show approved restaurants
        };
        query["city"] = new RegExp(city, "i");
        const cityCheck = yield restaurant_1.default.countDocuments(query);
        if (cityCheck === 0) {
            return res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                },
            });
        }
        if (selectedCuisines) {
            const cuisinesArray = selectedCuisines
                .split(",")
                .map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray };
        }
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
                { restaurantName: searchRegex },
                { cuisines: { $in: [searchRegex] } },
            ];
        }
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        // sortOption = "lastUpdated"
        const restaurants = yield restaurant_1.default.find(query)
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const total = yield restaurant_1.default.countDocuments(query);
        const response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.searchRestaurant = searchRestaurant;
// Get all restaurants (only approved ones)
const getRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurant_1.default.find({ status: "approved" });
        res.json(restaurants);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching restaurants" });
    }
});
exports.getRestaurants = getRestaurants;
// Get pending restaurants (admin only)
const getPendingRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurant_1.default.find({ status: "pending" });
        res.json({
            status: "success",
            data: restaurants,
            message: "Pending restaurants fetched successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error fetching pending restaurants",
            data: null
        });
    }
});
exports.getPendingRestaurants = getPendingRestaurants;
// Create a new restaurant (pending approval)
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantName, city, country, cuisines, menuItems, imageUrl, phoneNumber, description, addressLine1, street, ward, district, } = req.body;
    const restaurant = new restaurant_1.default({
        user: req.userId,
        restaurantName,
        city,
        country,
        cuisines,
        menuItems,
        imageUrl,
        phoneNumber,
        description,
        addressLine1,
        street,
        ward,
        district,
        status: "pending", // Set initial status as pending
    });
    yield restaurant.save();
    res.status(201).json(restaurant);
});
exports.createRestaurant = createRestaurant;
// Approve a restaurant (admin only)
const approveRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const { approvalNote } = req.body;
        const restaurant = yield restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // Update restaurant status
        restaurant.status = "approved";
        restaurant.approvalNote = approvalNote;
        restaurant.approvedBy = new mongoose_1.default.Types.ObjectId(req.userId);
        restaurant.approvedAt = new Date();
        yield restaurant.save();
        // Update user role to manager
        const user = yield user_1.default.findById(restaurant.user);
        if (user) {
            user.role = "manager";
            yield user.save();
        }
        res.json({
            status: "success",
            data: restaurant,
            message: "Restaurant approved and user role updated to manager"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error approving restaurant",
            data: null
        });
    }
});
exports.approveRestaurant = approveRestaurant;
// Reject a restaurant (admin only)
const rejectRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const { approvalNote } = req.body;
        const restaurant = yield restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        restaurant.status = "rejected";
        restaurant.approvalNote = approvalNote;
        yield restaurant.save();
        res.json(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error rejecting restaurant" });
    }
});
exports.rejectRestaurant = rejectRestaurant;
// Get restaurant by ID (only approved restaurants for regular users)
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { restaurantId } = req.params;
    const restaurant = yield restaurant_1.default.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    // If user is not admin and restaurant is not approved, return 404
    if (restaurant.status !== "approved" && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
});
exports.getRestaurantById = getRestaurantById;
// Update restaurant
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const restaurant = yield restaurant_1.default.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    // Check if user is the owner
    if (restaurant.user.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to update this restaurant" });
    }
    // Only set status to pending if it's a new restaurant (first submission)
    if (!restaurant.status) {
        restaurant.status = "pending";
    }
    const updatedRestaurant = yield restaurant_1.default.findByIdAndUpdate(restaurantId, req.body, { new: true });
    res.json(updatedRestaurant);
});
exports.updateRestaurant = updateRestaurant;
// Delete restaurant
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { restaurantId } = req.params;
    const restaurant = yield restaurant_1.default.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    // Check if user is the owner or admin
    if (restaurant.user.toString() !== req.userId && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this restaurant" });
    }
    yield restaurant_1.default.findByIdAndDelete(restaurantId);
    res.status(204).send();
});
exports.deleteRestaurant = deleteRestaurant;
exports.default = {
    getRestaurant: exports.getRestaurant,
    searchRestaurant: exports.searchRestaurant,
    getRestaurants: exports.getRestaurants,
    getPendingRestaurants: exports.getPendingRestaurants,
    createRestaurant: exports.createRestaurant,
    approveRestaurant: exports.approveRestaurant,
    rejectRestaurant: exports.rejectRestaurant,
    getRestaurantById: exports.getRestaurantById,
    updateRestaurant: exports.updateRestaurant,
    deleteRestaurant: exports.deleteRestaurant,
};
