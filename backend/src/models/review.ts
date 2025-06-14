import mongoose from "mongoose";

// Định nghĩa schema cho review
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Tạo model cho review
const Review = mongoose.model("Review", reviewSchema);

export { reviewSchema };
export default Review;