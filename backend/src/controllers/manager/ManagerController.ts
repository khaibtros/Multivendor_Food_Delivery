import { Request, Response } from "express";
import User from "../../models/user";
import Restaurant from "../../models/restaurant";
import Order from "../../models/order";

export const verifyManagerAccess = async (req: Request, res: Response) => {
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

    if (user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "Access denied. Manager role required." });
    }

    // Verify if the manager owns this restaurant
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      user: user._id,
    });

    if (!restaurant) {
      return res.status(403).json({ message: "Access denied to this restaurant" });
    }

    return res.status(200).json({ user, restaurant });
  } catch (error) {
    console.error("Error in verifyManagerAccess:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagerRestaurant = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "Access denied. Manager role required." });
    }

    // Get the restaurant owned by this manager with all fields
    const restaurant = await Restaurant.findOne({ user: user._id })
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
  } catch (error) {
    console.error("Error in getManagerRestaurant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantSellers = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: user._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Get all sellers associated with this restaurant
    const sellers = await User.find({ 
      restaurant: restaurant._id,
      role: "seller"
    }).select('-__v');

    return res.status(200).json(sellers);
  } catch (error) {
    console.error("Error in getRestaurantSellers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addRestaurantSeller = async (req: Request, res: Response) => {
  try {
    const { email, restaurantId } = req.body;
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!email || !restaurantId) {
      return res.status(400).json({ message: "Email and restaurant ID are required" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager role required." });
    }

    // Check if restaurant exists and belongs to manager
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      user: manager._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the user to be converted to seller
    const user = await User.findOne({ email });

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
    await user.save();

    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in addRestaurantSeller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeRestaurantSeller = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;
    const { sellerId } = req.params;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: manager._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Find and remove the seller
    const seller = await User.findOne({
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
    await seller.save();

    return res.status(200).json({ message: "Seller removed successfully" });
  } catch (error) {
    console.error("Error in removeRestaurantSeller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantShippers = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user || user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: user._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Get all shippers associated with this restaurant
    const shippers = await User.find({ 
      restaurant: restaurant._id,
      role: "shipper"
    }).select('-__v');

    return res.status(200).json(shippers);
  } catch (error) {
    console.error("Error in getRestaurantShippers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addRestaurantShipper = async (req: Request, res: Response) => {
  try {
    const { email, restaurantId } = req.body;
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!email || !restaurantId) {
      return res.status(400).json({ message: "Email and restaurant ID are required" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager role required." });
    }

    // Check if restaurant exists and belongs to manager
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      user: manager._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the user to be converted to shipper
    const user = await User.findOne({ email });

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
    await user.save();

    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in addRestaurantShipper:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeRestaurantShipper = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;
    const { shipperId } = req.params;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: manager._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Find and remove the shipper
    const shipper = await User.findOne({
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
    await shipper.save();

    return res.status(200).json({ message: "Shipper removed successfully" });
  } catch (error) {
    console.error("Error in removeRestaurantShipper:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantStats = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: manager._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Get total revenue from paid orders
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id,
          status: "paid"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Get total number of unique customers
    const totalCustomers = await Order.aggregate([
      {
        $match: {
          restaurant: restaurant._id
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

    // Get total number of orders
    const totalOrders = await Order.countDocuments({
      restaurant: restaurant._id
    });

    return res.status(200).json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers: totalCustomers[0]?.total || 0,
      totalOrders
    });
  } catch (error) {
    console.error("Error in getRestaurantStats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: manager._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Get all orders for this restaurant with populated user details
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("user", "email name")
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-__v');

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getRestaurantOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantCustomers = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;

    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const manager = await User.findOne({ auth0Id });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get the restaurant owned by this manager
    const restaurant = await Restaurant.findOne({ user: manager._id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this manager" });
    }

    // Get all unique customers who have placed orders at this restaurant
    const customers = await Order.aggregate([
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
  } catch (error) {
    console.error("Error in getRestaurantCustomers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
