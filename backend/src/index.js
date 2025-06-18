"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const MyUserRoute_1 = __importDefault(require("./routes/MyUserRoute"));
const cloudinary_1 = require("cloudinary");
const MyRestaurantRoute_1 = __importDefault(require("./routes/MyRestaurantRoute"));
const RestaurantRoute_1 = __importDefault(require("./routes/RestaurantRoute"));
const OrderRoute_1 = __importDefault(require("./routes/OrderRoute"));
const AdminRoute_1 = __importDefault(require("./routes/AdminRoute"));
const ManagerRoute_1 = __importDefault(require("./routes/ManagerRoute"));
const SellerRoute_1 = __importDefault(require("./routes/SellerRoute"));
const ShipperRoute_1 = __importDefault(require("./routes/ShipperRoute"));
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use("/api/order/checkout/webhook", express_1.default.raw({ type: "*/*" }));
app.use(express_1.default.json());
app.use("/api/my/user", MyUserRoute_1.default);
app.use("/api/my/restaurant", MyRestaurantRoute_1.default);
app.use("/api/restaurant", RestaurantRoute_1.default);
app.use("/api/order", OrderRoute_1.default);
app.use("/api/admin", AdminRoute_1.default);
app.use("/api/seller", SellerRoute_1.default);
app.use("/api/manager", ManagerRoute_1.default);
app.use("/api/shipper", ShipperRoute_1.default);
app.listen(7000, () => {
    console.log("Server running on localhost:7000");
});
