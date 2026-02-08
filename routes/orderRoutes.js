import express from "express";
import authMiddleware from "../middleware/auth.js";
import multer from "multer";
import Order from "../models/orderModel.js";
import fs from 'fs';
//import dotenv from "dotenv";

import {
  listOrders,
  placeOrder,
  verifyOrder,
  userOrder,
  updateStatus,
  removeOrder,
  getUserProfile,
  getMyOrderData,
  updateOrderStatus,
  
  getOrderById,
  getAllDeliveryBoyTotals,
  markOrderDelivered,
  listOrdersForStore,
  updatePaymentStatus,
  getPaymentStatus,
  placeOrderCOD,
  
} from "../controllar/ordercontrollar.js";
import { assignOrder } from "../controllar/AssignedOrderController.js";

const orderRouter = express.Router();
//new add


const dir = "uploads/payments";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: dir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });



/*orderRouter.post("/payment-pending", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    if (!orderData) return res.status(400).json({ success: false, message: "orderData missing" });

    let parsedOrder;
    try {
      parsedOrder = JSON.parse(orderData);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid orderData JSON" });
    }

    const newOrder = new Order({
      ...parsedOrder,
      status: "pending",                   // must match enum
      paymentScreenshot: req.file.path,
      payment: true,
      paymentMethod: "offline",
    });

    await newOrder.save();

    res.json({ success: true, message: "Payment uploaded & order saved", order: newOrder });
  } catch (err) {
    console.error("PAYMENT UPLOAD ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message || "Failed to upload payment" });
  }
});*
orderRouter.post(
  "/payment-pending",
  authMiddleware,
  upload.single("paymentScreenshot"),
  async (req, res) => {
    try {
      const { orderData } = req.body;

      if (!req.file)
        return res.status(400).json({ success: false, message: "No file uploaded" });

      if (!orderData)
        return res.status(400).json({ success: false, message: "orderData missing" });

      const parsedOrder = JSON.parse(orderData);

      const newOrder = new Order({
        userId: req.user.id,
        items: parsedOrder.items,
        amount: parsedOrder.amount,

        address: parsedOrder,

        paymentStatus: "PENDING",
        paymentScreenshot: req.file.filename,
        paymentMethod: "offline",

        payment: false,
        status: "pending",
      });

      await newOrder.save();

      res.json({
        success: true,
        message: "Payment uploaded & order saved",
        order: newOrder,
      });
    } catch (err) {
      console.error("PAYMENT UPLOAD ERROR 👉", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);*/
orderRouter.post(
  "/payment-pending",
  authMiddleware,
  upload.single("paymentScreenshot"),
  async (req, res) => {
    try {
      const { orderData } = req.body;

      if (!req.file)
        return res.status(400).json({ success: false, message: "No file uploaded" });

      if (!orderData)
        return res.status(400).json({ success: false, message: "orderData missing" });

      const parsedOrder = JSON.parse(orderData);

      const newOrder = new Order({
        userId: req.user.id,
         // ✅ IMPORTANT: storeIdRef saved inside items
      

        items: parsedOrder.items,
        amount: parsedOrder.amount,

        address: {
          firstName: parsedOrder.firstName,
          lastName: parsedOrder.lastName,
          email: parsedOrder.email,
          city: parsedOrder.city,
          street: parsedOrder.street,
          zipcode: parsedOrder.zipcode,
          linkdata: parsedOrder.linkdata,
          phone: parsedOrder.phone,
          age: parsedOrder.age,
          gender: parsedOrder.gender,
          address: parsedOrder.street,
        },

        paymentStatus: "PENDING",
        paymentScreenshot: req.file.filename,

        paymentMethod: "online",   // ✅ FIXED
        payment: false,
        status: "pending",//pending but i am change assinge test
      });

      await newOrder.save();

      res.json({
        success: true,
        message: "Payment uploaded & order saved",
        order: newOrder,
      });
    } catch (err) {
      console.error("PAYMENT UPLOAD ERROR 👉", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);
//singel store data
orderRouter.get("/store/:storeId", async (req, res) => {
  const { storeId } = req.params;

  try {
    const orders = await Order.find({ "items.storeId": storeId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.json({ success: false, message: "No orders found for this store" });
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

orderRouter.get("/generate-qr/:orderId", authMiddleware, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // You can fetch order details if needed
    // const order = await Order.findById(orderId);

    const upiId = process.env.UPI_ID; // .env: VITE_UPI_ID or UPI_ID
    const name = req.user.firstName || "Customer"; // dynamic name
    const amount = req.query.amount || "0";

    // QR Code URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=${upiId}&pn=${name}&tn=FoodOrder&am=${amount}&cu=INR`;

    res.json({ success: true, qrUrl });
  } catch (err) {
    console.error("QR GENERATE ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//orderRouter.post("/payment-pending", upload.single("paymentScreenshot"), paymentPendingOrder);
//orderRouter.post("/payment-pending", authMiddleware,upload.single("paymentScreenshot"),paymentPendingOrder);
orderRouter.post("/update-payment-status", updatePaymentStatus);
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD); //new code

orderRouter.get("/payment-status/:orderId", getPaymentStatus);
//last
orderRouter.post("/place", authMiddleware, placeOrder);
//orderRouter.post("/places", authMiddleware, placeOrders);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrder);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateOrderStatus);
orderRouter.post("/statusonly", updateStatus);
orderRouter.delete("/remove/:id", removeOrder);
orderRouter.post("/remove", removeOrder);
orderRouter.post("/profile", getUserProfile);
orderRouter.post("/my-data", getMyOrderData);
orderRouter.post("/my-order", getMyOrderData);
orderRouter.get("/order/:id", getOrderById);
orderRouter.get("/all-deliveryboy-totals", getAllDeliveryBoyTotals);
orderRouter.post("/assign",assignOrder)
orderRouter.put("/deliver/:orderId", markOrderDelivered);
//orderRouter.get("/store/:storeId", listOrdersForStore);

orderRouter.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;

  await Order.findByIdAndUpdate(req.params.id, { status });

  res.json({ success: true });
});

export default orderRouter;

