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
const restaurant_1 = __importDefault(require("../models/restaurant"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = __importDefault(require("../models/order"));
const getMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_1.default.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "restaurant not found" });
        }
        res.json(restaurant);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error fetching restaurant" });
    }
});
const createMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const existingRestaurant = yield restaurant_1.default.findOne({ user: req.userId });
        if (existingRestaurant) {
            return res
                .status(409)
                .json({ message: "User restaurant already exists" });
        }
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const mainImageFile = files.find(file => file.fieldname === "imageFile");
        if (!mainImageFile) {
            return res.status(400).json({ message: "Restaurant image is required" });
        }
        let imageUrl;
        try {
            imageUrl = yield uploadImage(mainImageFile);
        }
        catch (error) {
            console.error("Error uploading main image:", error);
            return res.status(500).json({
                message: "Error uploading restaurant image",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
        try {
            const restaurant = new restaurant_1.default(Object.assign(Object.assign({}, req.body), { status: "pending", imageUrl, user: new mongoose_1.default.Types.ObjectId(req.userId), lastUpdated: new Date() }));
            // Handle menu item images
            const menuItemFiles = files.filter(file => file.fieldname.startsWith("menuItems["));
            for (const file of menuItemFiles) {
                const index = parseInt(((_a = file.fieldname.match(/\[(\d+)\]\[imageFile\]/)) === null || _a === void 0 ? void 0 : _a[1]) || "0");
                if (!isNaN(index) && index < restaurant.menuItems.length) {
                    try {
                        const imageUrl = yield uploadImage(file);
                        restaurant.menuItems[index].imageUrl = imageUrl;
                    }
                    catch (error) {
                        console.error(`Error uploading menu item image for index ${index}:`, error);
                        // Continue with other menu items even if one fails
                    }
                }
            }
            yield restaurant.save();
            res.status(201).send(restaurant);
        }
        catch (error) {
            console.error("Error creating restaurant:", error);
            return res.status(500).json({
                message: "Error creating restaurant",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
const updateMyRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const restaurant = yield restaurant_1.default.findOne({
            user: req.userId,
        });
        if (!restaurant) {
            return res.status(404).json({ message: "restaurant not found" });
        }
        const oldImageUrl = restaurant.imageUrl;
        const oldMenuItemImages = restaurant.menuItems.map(item => item.imageUrl).filter((url) => typeof url === 'string');
        // Update all fields
        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.phoneNumber = req.body.phoneNumber;
        restaurant.description = req.body.description;
        restaurant.addressLine1 = req.body.addressLine1;
        restaurant.street = req.body.street;
        restaurant.ward = req.body.ward;
        restaurant.district = req.body.district;
        restaurant.openingHours = req.body.openingHours;
        restaurant.lastUpdated = new Date();
        const files = req.files;
        // Handle main restaurant image
        if (files) {
            const mainImageFile = files.find(file => file.fieldname === "imageFile");
            if (mainImageFile) {
                try {
                    const imageUrl = yield uploadImage(mainImageFile);
                    restaurant.imageUrl = imageUrl;
                    // Delete old image if it exists
                    if (typeof oldImageUrl === 'string') {
                        yield deleteImage(oldImageUrl);
                    }
                }
                catch (error) {
                    console.error("Error updating main image:", error);
                    return res.status(500).json({ message: "Error updating restaurant image" });
                }
            }
        }
        // Handle menu item images
        if (files) {
            const menuItemFiles = files.filter(file => file.fieldname.startsWith("menuItems["));
            for (const file of menuItemFiles) {
                const index = parseInt(((_a = file.fieldname.match(/\[(\d+)\]\[imageFile\]/)) === null || _a === void 0 ? void 0 : _a[1]) || "0");
                if (!isNaN(index) && index < restaurant.menuItems.length) {
                    try {
                        const imageUrl = yield uploadImage(file);
                        // Delete old image if it exists
                        if (oldMenuItemImages[index] && typeof oldMenuItemImages[index] === 'string') {
                            yield deleteImage(oldMenuItemImages[index]);
                        }
                        restaurant.menuItems[index].imageUrl = imageUrl;
                    }
                    catch (error) {
                        console.error(`Error updating menu item image for index ${index}:`, error);
                        // Continue with other menu items even if one fails
                    }
                }
            }
        }
        yield restaurant.save();
        res.status(200).send(restaurant);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
const getMyRestaurantOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurant_1.default.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "restaurant not found" });
        }
        const orders = yield order_1.default.find({ restaurant: restaurant._id })
            .populate("restaurant")
            .populate("user");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
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
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
    return uploadResponse.url;
});
const deleteImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        yield cloudinary_1.default.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("Error deleting image:", error);
    }
});
exports.default = {
    // updateOrderStatus,
    getMyRestaurantOrders,
    getMyRestaurant,
    createMyRestaurant,
    updateMyRestaurant,
};
