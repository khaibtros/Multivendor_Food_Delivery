import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  street: {
    type: String,
  },
  ward: {
    type: String,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
