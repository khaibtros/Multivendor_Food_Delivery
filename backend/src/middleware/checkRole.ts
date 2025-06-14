import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  userId: string;
  user: {
    role: string;
  };
}

export const checkRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
}; 