import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Helper function to parse FormData fields
export const parseFormDataFields = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.cuisines) {
    req.body.cuisines = JSON.parse(req.body.cuisines);
  }
  if (req.body.menuItems) {
    req.body.menuItems = JSON.parse(req.body.menuItems);
  }
  if (req.body.openingHours) {
    req.body.openingHours = JSON.parse(req.body.openingHours);
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  parseFormDataFields,
  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines must be an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu item price is required and must be a positive number"),
  body("menuItems.*.toppings")
    .optional()
    .isArray()
    .withMessage("Toppings must be an array"),
  body("menuItems.*.toppings.*.categoryName")
    .optional()
    .notEmpty()
    .withMessage("Topping category name is required"),
  body("menuItems.*.toppings.*.options")
    .optional()
    .isArray()
    .withMessage("Topping options must be an array")
    .not()
    .isEmpty()
    .withMessage("Topping options cannot be empty"),
  body("menuItems.*.toppings.*.options.*.name")
    .optional()
    .notEmpty()
    .withMessage("Topping option name is required"),
  body("menuItems.*.toppings.*.options.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Topping option price must be a positive number"),
  body("addressLine1").notEmpty().withMessage("Address line 1 is required"),
  body("street").notEmpty().withMessage("Street is required"),
  body("ward").notEmpty().withMessage("Ward is required"),
  body("district").notEmpty().withMessage("District is required"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(\+?[0-9]{1,4}[\s-])?(?!0+\s+,?$)\d{10,11}$/)
    .withMessage("Please enter a valid phone number"),
  body("openingHours")
    .isArray()
    .withMessage("Opening hours must be an array")
    .not()
    .isEmpty()
    .withMessage("Opening hours cannot be empty"),
  body("openingHours.*.day")
    .notEmpty()
    .withMessage("Day is required")
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Invalid day of week"),
  body("openingHours.*.open")
    .notEmpty()
    .withMessage("Opening time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid opening time format (HH:MM)"),
  body("openingHours.*.close")
    .notEmpty()
    .withMessage("Closing time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid closing time format (HH:MM)"),
  handleValidationErrors,
];
