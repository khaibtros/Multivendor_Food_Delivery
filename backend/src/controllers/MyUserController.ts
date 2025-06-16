import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id, email } = req.body;

    if (!auth0Id || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User({
      auth0Id,
      email,
      name: email.split('@')[0], // Default name from email
      role: "user", // Default role
      phone: "", // Empty phone number
      addressLine1: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: ""
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, addressLine1, street, ward, district, city, country } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.phone = phone;
    user.addressLine1 = addressLine1;
    user.street = street;
    user.ward = ward;
    user.district = district;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};
