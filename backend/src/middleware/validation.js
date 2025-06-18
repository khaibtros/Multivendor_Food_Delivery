"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMyRestaurantRequest = exports.validateMyUserRequest = exports.parseFormDataFields = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
});
// Helper function to parse FormData fields
const parseFormDataFields = (req, res, next) => {
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
exports.parseFormDataFields = parseFormDataFields;
exports.validateMyUserRequest = [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Name must be a string"),
    (0, express_validator_1.body)("addressLine1")
        .isString()
        .notEmpty()
        .withMessage("AddressLine1 must be a string"),
    (0, express_validator_1.body)("city").isString().notEmpty().withMessage("City must be a string"),
    (0, express_validator_1.body)("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors,
];
exports.validateMyRestaurantRequest = [
    exports.parseFormDataFields,
    (0, express_validator_1.body)("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("cuisines")
        .isArray()
        .withMessage("Cuisines must be an array")
        .not()
        .isEmpty()
        .withMessage("Cuisines array cannot be empty"),
    (0, express_validator_1.body)("menuItems").isArray().withMessage("Menu items must be an array"),
    (0, express_validator_1.body)("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    (0, express_validator_1.body)("menuItems.*.price")
        .isFloat({ min: 0 })
        .withMessage("Menu item price is required and must be a positive number"),
    (0, express_validator_1.body)("menuItems.*.toppings")
        .optional()
        .isArray()
        .withMessage("Toppings must be an array"),
    (0, express_validator_1.body)("menuItems.*.toppings.*.categoryName")
        .optional()
        .notEmpty()
        .withMessage("Topping category name is required"),
    (0, express_validator_1.body)("menuItems.*.toppings.*.options")
        .optional()
        .isArray()
        .withMessage("Topping options must be an array")
        .not()
        .isEmpty()
        .withMessage("Topping options cannot be empty"),
    (0, express_validator_1.body)("menuItems.*.toppings.*.options.*.name")
        .optional()
        .notEmpty()
        .withMessage("Topping option name is required"),
    (0, express_validator_1.body)("menuItems.*.toppings.*.options.*.price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Topping option price must be a positive number"),
    (0, express_validator_1.body)("addressLine1").notEmpty().withMessage("Address line 1 is required"),
    (0, express_validator_1.body)("street").notEmpty().withMessage("Street is required"),
    (0, express_validator_1.body)("ward").notEmpty().withMessage("Ward is required"),
    (0, express_validator_1.body)("district").notEmpty().withMessage("District is required"),
    (0, express_validator_1.body)("phoneNumber")
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^(\+?[0-9]{1,4}[\s-])?(?!0+\s+,?$)\d{10,11}$/)
        .withMessage("Please enter a valid phone number"),
    (0, express_validator_1.body)("openingHours")
        .isArray()
        .withMessage("Opening hours must be an array")
        .not()
        .isEmpty()
        .withMessage("Opening hours cannot be empty"),
    (0, express_validator_1.body)("openingHours.*.day")
        .notEmpty()
        .withMessage("Day is required")
        .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        .withMessage("Invalid day of week"),
    (0, express_validator_1.body)("openingHours.*.open")
        .notEmpty()
        .withMessage("Opening time is required")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Invalid opening time format (HH:MM)"),
    (0, express_validator_1.body)("openingHours.*.close")
        .notEmpty()
        .withMessage("Closing time is required")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Invalid closing time format (HH:MM)"),
    handleValidationErrors,
];
