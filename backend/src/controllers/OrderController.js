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
const stripe_1 = __importDefault(require("stripe"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const order_1 = __importDefault(require("../models/order"));
const STRIPE = new stripe_1.default(process.env.STRIPE_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ user: req.userId })
            .populate("restaurant")
            .populate("user");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let event;
    try {
        const sig = req.headers["stripe-signature"];
        event = STRIPE.webhooks.constructEvent(req.body, sig, STRIPE_ENDPOINT_SECRET);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const order = yield order_1.default.findById((_a = event.data.object.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.totalAmount = (_b = event.data.object.amount_total) !== null && _b !== void 0 ? _b : 0;
        order.paymentStatus = "paid";
        yield order.save();
    }
    res.status(200).send();
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const checkoutSessionRequest = req.body;
        const restaurant = yield restaurant_1.default.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        // Calculate total amount
        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);
        const totalAmount = lineItems.reduce((total, item) => { var _a; return total + (((_a = item.price_data) === null || _a === void 0 ? void 0 : _a.unit_amount) || 0) * (item.quantity || 0); }, 0);
        const newOrder = new order_1.default({
            restaurant: restaurant,
            user: req.userId,
            status: "pending",
            paymentMethod: checkoutSessionRequest.paymentMethod,
            paymentStatus: "unpaid",
            totalAmount,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        });
        // Save order first
        yield newOrder.save();
        // If COD, return success immediately
        if (checkoutSessionRequest.paymentMethod === "cod") {
            return res.json({
                url: `${FRONTEND_URL}/order-status?success=true`,
                orderId: newOrder._id
            });
        }
        // For online payment, create Stripe session
        const session = yield createSession(lineItems, newOrder._id.toString(), restaurant._id.toString());
        if (!session.url) {
            return res.status(500).json({ message: "Error creating stripe session" });
        }
        res.json({ url: session.url });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: ((_a = error.raw) === null || _a === void 0 ? void 0 : _a.message) || error.message });
    }
});
// // Function to update order status (for sellers)
// const updateOrderStatus = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const userId = req.userId;
//     // Get user to check role
//     const user = await User.findById(userId);
//     if (!user || user.role !== "seller") {
//       return res.status(403).json({ message: "Only sellers can update order status" });
//     }
//     const order = await Order.findOne({
//       _id: orderId,
//       restaurant: user.restaurant
//     });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     // Validate status transitions for sellers
//     const validTransitions = {
//       pending: ["confirmed", "inProgress"],
//       confirmed: ["inProgress"],
//       inProgress: ["outForDelivery"]
//     };
//     if (!validTransitions[order.status as keyof typeof validTransitions]?.includes(status)) {
//       return res.status(400).json({ message: "Invalid status transition" });
//     }
//     order.status = status;
//     await order.save();
//     res.json({ message: "Order status updated successfully", order });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error updating order status" });
//   }
// };
// // Function for shippers to confirm delivery and COD payment
// const confirmDeliveryAndPayment = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.userId;
//     // Get user to check role
//     const user = await User.findById(userId);
//     if (!user || user.role !== "shipper") {
//       return res.status(403).json({ message: "Only shippers can confirm delivery" });
//     }
//     const order = await Order.findOne({
//       _id: orderId,
//       shipper: userId,
//       status: "outForDelivery"
//     });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found or not assigned to you" });
//     }
//     // Update both status and payment status
//     order.status = "delivered";
//     // If it's a COD order, mark payment as paid
//     if (order.paymentMethod === "cod") {
//       order.paymentStatus = "paid";
//     }
//     await order.save();
//     res.json({ 
//       message: "Delivery confirmed successfully" + 
//       (order.paymentMethod === "cod" ? " and payment received" : ""),
//       order 
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error confirming delivery" });
//   }
// };
const createLineItems = (checkoutSessionRequest, menuItems) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString());
        if (!menuItem) {
            throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
        }
        const line_item = {
            price_data: {
                currency: "gbp",
                unit_amount: menuItem.price,
                product_data: {
                    name: menuItem.name,
                },
            },
            quantity: parseInt(cartItem.quantity),
        };
        return line_item;
    });
    return lineItems;
};
const createSession = (lineItems, orderId, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionData = yield STRIPE.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        metadata: {
            orderId,
            restaurantId,
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    });
    return sessionData;
});
exports.default = {
    getMyOrders,
    createCheckoutSession,
    stripeWebhookHandler
};
