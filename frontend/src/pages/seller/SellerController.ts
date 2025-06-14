import { Request, Response } from "express";
import User from "../../models/user";
import Restaurant from "../../models/restaurant";

export const verifySellerAccess = async (req: Request, res: Response) => {
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

    if (user.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Access denied. Seller role required." });
    }

    // Verify if the seller is associated with this restaurant
    if (user.restaurant?.toString() !== restaurantId) {
      return res.status(403).json({ message: "Access denied to this restaurant" });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json({ user, restaurant });
  } catch (error) {
    console.error("Error in verifySellerAccess:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
        role: user.role
      }, 
      restaurant 
    });
  } catch (error) {
    console.error("Error in getSellerRestaurant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}; 