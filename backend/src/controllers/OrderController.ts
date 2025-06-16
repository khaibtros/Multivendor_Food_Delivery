import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";
import User from "../models/user";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  restaurantId: string;
  paymentMethod: "cod" | "online";
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total ?? 0;
    order.paymentStatus = "paid";
    
    await order.save();
  }

  res.status(200).send();
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Calculate total amount
    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );
    const totalAmount = lineItems.reduce(
      (total, item) => total + (item.price_data?.unit_amount || 0) * (item.quantity || 0),
      0
    );

    const newOrder = new Order({
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
    await newOrder.save();

    // If COD, return success immediately
    if (checkoutSessionRequest.paymentMethod === "cod") {
      return res.json({ 
        url: `${FRONTEND_URL}/order-status?success=true`,
        orderId: newOrder._id 
      });
    }

    // For online payment, create Stripe session
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw?.message || error.message });
  }
};

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

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
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

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
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
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler
};
