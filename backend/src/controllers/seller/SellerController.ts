import { Request, Response } from "express";
import User from "../../models/user";
import Restaurant from "../../models/restaurant";
import Order from "../../models/order";

export const getSellerRestaurant = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

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
    const restaurant = await Restaurant.findById(user.restaurant)
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
  } catch (error) {
    console.error("Error in getSellerRestaurant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

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
    const orders = await Order.find({ restaurant: user.restaurant })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("user", "email name") // Include user details
      .lean(); // Convert to plain JavaScript object

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getSellerOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    // Get user to check role
    const user = await User.findById(userId);
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can update order status" });
    }

    const order = await Order.findOne({
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

    if (!validTransitions[order.status as keyof typeof validTransitions]?.includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
}; 