"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Định nghĩa schema cho review
const reviewSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.reviewSchema = reviewSchema;
// Tạo model cho review
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
