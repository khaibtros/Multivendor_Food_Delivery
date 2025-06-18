"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const review_1 = require("./review");
// Menu item schema
const menuItemSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: String },
    isAvailable: { type: Boolean, default: true },
    reviews: [review_1.reviewSchema],
    toppings: [
        {
            categoryName: { type: String, required: true },
            options: [
                {
                    name: { type: String, required: true },
                    price: { type: Number, required: true }
                }
            ]
        }
    ]
});
// Opening hours schema
const openingHourSchema = new mongoose_1.default.Schema({
    day: { type: String, required: true }, // "Monday", "Tuesday", ...
    open: { type: String, required: true }, // "08:00"
    close: { type: String, required: true }, // "22:00"
});
// Restaurant schema
const restaurantSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantName: {
        type: String,
        required: true,
        unique: true
    },
    addressLine1: { type: String, required: true },
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    cuisines: [{ type: String, required: true }],
    menuItems: [menuItemSchema],
    imageUrl: { type: String, required: true },
    openingHours: [openingHourSchema],
    lastUpdated: { type: Date, required: true },
    reviews: [review_1.reviewSchema],
    phoneNumber: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    description: { type: String },
    // New fields for manager dashboard
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    // Approval status fields
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    approvalNote: { type: String },
    approvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    approvedAt: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const Restaurant = mongoose_1.default.model("Restaurant", restaurantSchema);
exports.default = Restaurant;
