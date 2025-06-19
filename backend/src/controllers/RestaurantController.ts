import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import mongoose from "mongoose";
import User from "../models/user";

interface AuthRequest extends Request {
  userId: string;
  user: {
    role: string;
  };
}

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {
      status: "approved" // Only show approved restaurants
    };

    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
        { "menuItems.name": searchRegex },
        { ward: searchRegex },
        { district: searchRegex },
        { city: searchRegex },
        { addressLine1: searchRegex },
        { street: searchRegex },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all restaurants (only approved ones)
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({ status: "approved" });
    res.json(restaurants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching restaurants" });
  }
};

// Get pending restaurants (admin only)
export const getPendingRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({ status: "pending" });
    res.json({
      status: "success",
      data: restaurants,
      message: "Pending restaurants fetched successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Error fetching pending restaurants",
      data: null
    });
  }
};

// Create a new restaurant (pending approval)
export const createRestaurant = async (req: Request, res: Response) => {
  const {
    restaurantName,
    city,
    country,
    cuisines,
    menuItems,
    imageUrl,
    phoneNumber,
    description,
    addressLine1,
    street,
    ward,
    district,
  } = req.body;

  const restaurant = new Restaurant({
    user: req.userId,
    restaurantName,
    city,
    country,
    cuisines,
    menuItems,
    imageUrl,
    phoneNumber,
    description,
    addressLine1,
    street,
    ward,
    district,
    status: "pending", // Set initial status as pending
  });

  await restaurant.save();
  res.status(201).json(restaurant);
};

// Approve a restaurant (admin only)
export const approveRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { approvalNote } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update restaurant status
    restaurant.status = "approved";
    restaurant.approvalNote = approvalNote;
    restaurant.approvedBy = new mongoose.Types.ObjectId(req.userId);
    restaurant.approvedAt = new Date();
    await restaurant.save();

    // Update user role to manager
    const user = await User.findById(restaurant.user);
    if (user) {
      user.role = "manager";
      await user.save();
    }

    res.json({
      status: "success",
      data: restaurant,
      message: "Restaurant approved and user role updated to manager"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status: "error",
      message: "Error approving restaurant",
      data: null
    });
  }
};

// Reject a restaurant (admin only)
export const rejectRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { approvalNote } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.status = "rejected";
    restaurant.approvalNote = approvalNote;
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error rejecting restaurant" });
  }
};

// Get restaurant by ID (only approved restaurants for regular users)
export const getRestaurantById = async (req: AuthRequest, res: Response) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  // If user is not admin and restaurant is not approved, return 404
  if (restaurant.status !== "approved" && req.user?.role !== "admin") {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  res.json(restaurant);
};

// Update restaurant
export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  // Check if user is the owner
  if (restaurant.user.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized to update this restaurant" });
  }

  // Only set status to pending if it's a new restaurant (first submission)
  if (!restaurant.status) {
    restaurant.status = "pending";
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    req.body,
    { new: true }
  );

  res.json(updatedRestaurant);
};

// Delete restaurant
export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  // Check if user is the owner or admin
  if (restaurant.user.toString() !== req.userId && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this restaurant" });
  }

  await Restaurant.findByIdAndDelete(restaurantId);
  res.status(204).send();
};

export default {
  getRestaurant,
  searchRestaurant,
  getRestaurants,
  getPendingRestaurants,
  createRestaurant,
  approveRestaurant,
  rejectRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
