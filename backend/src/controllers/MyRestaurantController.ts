import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const mainImageFile = files.find(file => file.fieldname === "imageFile");
    if (!mainImageFile) {
      return res.status(400).json({ message: "Restaurant image is required" });
    }

    let imageUrl;
    try {
      imageUrl = await uploadImage(mainImageFile);
    } catch (error) {
      console.error("Error uploading main image:", error);
      return res.status(500).json({ 
        message: "Error uploading restaurant image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }

    try {
      const restaurant = new Restaurant({
        ...req.body,
        status: "pending",
        imageUrl,
        user: new mongoose.Types.ObjectId(req.userId),
        lastUpdated: new Date()
      });

      // Handle menu item images
      const menuItemFiles = files.filter(file => file.fieldname.startsWith("menuItems["));
      for (const file of menuItemFiles) {
        const index = parseInt(file.fieldname.match(/\[(\d+)\]\[imageFile\]/)?.[1] || "0");
        if (!isNaN(index) && index < restaurant.menuItems.length) {
          try {
            const imageUrl = await uploadImage(file);
            restaurant.menuItems[index].imageUrl = imageUrl;
          } catch (error) {
            console.error(`Error uploading menu item image for index ${index}:`, error);
            // Continue with other menu items even if one fails
          }
        }
      }

      await restaurant.save();
      res.status(201).send(restaurant);
    } catch (error) {
      console.error("Error creating restaurant:", error);
      return res.status(500).json({ 
        message: "Error creating restaurant",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ 
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    const oldImageUrl = restaurant.imageUrl;
    const oldMenuItemImages = restaurant.menuItems.map(item => item.imageUrl).filter((url): url is string => typeof url === 'string');

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    const files = req.files as Express.Multer.File[];

    // Handle main restaurant image
    if (files) {
      const mainImageFile = files.find(file => file.fieldname === "imageFile");
      if (mainImageFile) {
        try {
          const imageUrl = await uploadImage(mainImageFile);
          restaurant.imageUrl = imageUrl;
          // Delete old image if it exists
          if (typeof oldImageUrl === 'string') {
            await deleteImage(oldImageUrl);
          }
        } catch (error) {
          console.error("Error updating main image:", error);
          return res.status(500).json({ message: "Error updating restaurant image" });
        }
      }
    }

    // Handle menu item images
    if (files) {
      const menuItemFiles = files.filter(file => file.fieldname.startsWith("menuItems["))
      for (const file of menuItemFiles) {
        const index = parseInt(file.fieldname.match(/\[(\d+)\]\[imageFile\]/)?.[1] || "0");
        if (!isNaN(index) && index < restaurant.menuItems.length) {
          try {
            const imageUrl = await uploadImage(file);
            // Delete old image if it exists
            if (oldMenuItemImages[index] && typeof oldMenuItemImages[index] === 'string') {
              await deleteImage(oldMenuItemImages[index]);
            }
            restaurant.menuItems[index].imageUrl = imageUrl;
          } catch (error) {
            console.error(`Error updating menu item image for index ${index}:`, error);
            // Continue with other menu items even if one fails
          }
        }
      }
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

// const updateOrderStatus = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "order not found" });
//     }

//     const restaurant = await Restaurant.findById(order.restaurant);

//     if (restaurant?.user?._id.toString() !== req.userId) {
//       return res.status(401).send();
//     }

//     order.status = status;
//     await order.save();

//     res.status(200).json(order);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "unable to update order status" });
//   }
// };

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

const deleteImage = async (imageUrl: string) => {
  try {
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export default {
  // updateOrderStatus,
  getMyRestaurantOrders,
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
