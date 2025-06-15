import { Request, Response } from "express";
import User from "../../models/user";

const verifyAdminAccess = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ auth0Id: req.auth0Id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    res.status(200).json({
      message: "Admin access verified",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying admin access" });
  }
};


export default {
  verifyAdminAccess,
}; 