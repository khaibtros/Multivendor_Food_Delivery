import mongoose, { InferSchemaType } from "mongoose";
import { reviewSchema } from "./review";

// Menu item schema
const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }, 
  category: { type: String }, 
  isAvailable: { type: Boolean, default: true }, 
  reviews: [reviewSchema],
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

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

// Opening hours schema
const openingHourSchema = new mongoose.Schema({
  day: { type: String, required: true }, // "Monday", "Tuesday", ...
  open: { type: String, required: true }, // "08:00"
  close: { type: String, required: true }, // "22:00"
});

// Restaurant schema
const restaurantSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
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
  reviews: [reviewSchema],
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
    type: mongoose.Schema.Types.ObjectId,
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

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
