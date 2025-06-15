import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Restaurant",
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  }, 
  cartItems: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      toppings: [
        {
          categoryName: { type: String, required: true },
          selectedOption: {
            name: { type: String, required: true },
            price: { type: Number, required: true }
          }
        }
      ],
      itemTotal: { type: Number, required: true } 
    },
  ],
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "inProgress", "outForDelivery", "delivered"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
