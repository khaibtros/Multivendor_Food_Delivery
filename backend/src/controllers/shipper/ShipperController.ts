import { Request, Response } from "express";
import User from "../../models/user";
import Restaurant from "../../models/restaurant";
import Order from "../../models/order";

export const verifyShipperAccess = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;
    const restaurantId = req.params.restaurantId;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "shipper") {
      return res
        .status(403)
        .json({ message: "Access denied. Shipper role required." });
    }

    // Verify if the shipper is associated with this restaurant
    if (user.restaurant?.toString() !== restaurantId) {
      return res.status(403).json({ message: "Access denied to this restaurant" });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json({ user, restaurant });
  } catch (error) {
    console.error("Error in verifyShipperAccess:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getShipperRestaurant = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

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
        name: user.name,
        role: user.role
      }, 
      restaurant 
    });
  } catch (error) {
    console.error("Error in getShipperRestaurant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getShipperOrders = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;
    const { status } = req.query;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

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
    const query: any = {
      restaurant: user.restaurant,
      shipper: user._id
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Get orders
    const orders = await Order.find(query)
      .populate("restaurant", "restaurantName addressLine1 city")
      .populate("user", "email name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getShipperOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "shipper") {
      return res.status(403).json({ message: "Access denied. Shipper role required." });
    }

    // Find the order
    const order = await Order.findOne({
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

    await order.save();

    return res.status(200).json({ 
      message: "Delivery confirmed successfully" + 
      (order.paymentMethod === "cod" ? " and payment received" : ""),
      order 
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}; 