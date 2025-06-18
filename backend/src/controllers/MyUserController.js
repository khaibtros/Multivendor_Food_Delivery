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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.default.findOne({ _id: req.userId });
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(currentUser);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
const createCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id, email } = req.body;
        if (!auth0Id || !email) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingUser = yield user_1.default.findOne({ auth0Id });
        if (existingUser) {
            return res.status(200).json(existingUser);
        }
        const newUser = new user_1.default({
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
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        console.log("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, addressLine1, street, ward, district, city, country } = req.body;
        const user = yield user_1.default.findById(req.userId);
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
        yield user.save();
        res.send(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
});
exports.default = {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser,
};
