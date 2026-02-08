import userModel from "../models/userModel.js"
//import Razorpay from "razorpay"
import Stripe from "stripe"
import { autoAssignOrder } from "../assignOrder/assignOrder.js"
import Deliver from "../models/deliverModel.js";
import Order from "../models/orderModel.js";
import DelBoy from "../models/delBoyModel.js";
import mongoose from "mongoose";
import AssignedOrder from "../models/AssignedOrderModel.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const verifyOrder = async (req, res) => { //old code
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment Successful" })
    }
    else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Pay" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })

  }

}
const placeOrder = async (req, res) => { //old and veryimportant code
  const frontend_url = "http://localhost:5175/";

  try {
    // 🔐 Get userId from token middleware
    const userId = req.user.id;   // 👈 VERY IMPORTANT

    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.json({
        success: false,
        message: "Missing order fields",
      });
    }

    // 1️⃣ Create Order
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone,
      firstName: req.body.firstName,
      street: req.body.street,
      status: "pending"

    });

    await newOrder.save();

    // 2️⃣ Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // 3️⃣ Create Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Delivery charge
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 5 * 100,
      },
      quantity: 1,
    });

    // 4️⃣ Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}my-order`,
      cancel_url: `${frontend_url}verify?success=false&orderId=${newOrder._id}`,
    });

    // 5️⃣ Auto assign delivery boy
    autoAssignOrder(newOrder._id);

    // 6️⃣ Send success
    res.json({
      success: true,
      session_url: session.url,
      order: newOrder,
    });

  } catch (error) {
    console.error("PLACE ORDER ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message,   // 👈 send real error to frontend
    });
  }
};
 
/*const razorpay = new Razorpay({
    key_id:"rzp_test_qR05WbFxZAAsek" , // Your Razorpay key_id
    key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay key_secret
  });
  */
 




export const getAllDeliveryBoyTotals = async (req, res) => {
  try {
    // 1. Get all delivery boys
    const deliveryBoys = await DelBoy.find();

    const result = [];

    // 2. For each delivery boy, count orders
    for (let boy of deliveryBoys) {
      const totalOrders = await Order.countDocuments({
        assignedTo: boy._id,
      });

      const deliveredCount = await Order.countDocuments({
        assignedTo: boy._id,
        status: "delivered",
      });

      const pendingCount = await Order.countDocuments({
        assignedTo: boy._id,
        status: { $ne: "delivered" },
      });

      result.push({
        _id: boy._id,
        name: boy.name,
        userSpecialId: boy.userSpecialId,
        totalOrders,
        deliveredCount,
        pendingCount,
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("GET ALL TOTALS ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery boy totals",
    });
  }
};

export const sendToDeliveryBoy = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    if (!orderId || !deliveryBoyId) {
      return res.json({
        success: false,
        message: "orderId & deliveryBoyId required"
      });
    }

    // ✅ check delivery boy online
    const boy = await Deliver.findById(deliveryBoyId);

    if (!boy || !boy.isActive) {
      return res.json({
        success: false,
        message: "Delivery boy offline"
      });
    }

    // ✅ assign order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoyId,
        status: "Assigned"
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Order assigned to delivery boy",
      data: order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
export const getAssignedOrder = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;

    const order = await Order.findOne({
      deliveryBoyId,
      status: "Assigned"
    });

    if (!order) return res.status(404).json(null);

    res.json(order);
  } catch (err) {
    res.status(500).json(null);
  }
};
export const acceptOrder = async (req, res) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    status: "Out_for_delivery"
  });

  res.json({ success: true });
};
export const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    deliveryBoyId: null,
    status: "pending"
  });

  res.json({ success: true });
};

export const assignPendingOrders = async (delBoyId) => {
  const delBoy = await DelBoy.findById(delBoyId);
  if (!delBoy || !delBoy.isOnline) return;

  const pendingOrders = await Order.find({
    status: "Pending",
    deliveryBoyId: null
  });

  for (let order of pendingOrders) {
    order.deliveryBoyId = delBoyId;
    order.status = "Assigned";
    await order.save();

    io.to(delBoy.socketId).emit("new-order", order);
  }
};
export const assign = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    if (!orderId || !deliveryBoyId) {
      return res.status(400).json({ success: false, message: "Order ID and Delivery Boy ID required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const delBoy = await DelBoy.findById(deliveryBoyId);
    if (!delBoy) return res.status(404).json({ success: false, message: "Delivery Boy not found" });

    // Assign order
    order.delBoy = delBoy._id;
    order.status = "Assigned"; // optional
    await order.save();

    res.json({ success: true, message: `Order ${order._id} assigned to ${delBoy.name}` });
  } catch (err) {
    console.error("ASSIGN ERROR 👉", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//user order for frontend
const userOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId })
    res.json({ success: true, message: "Done", data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error Coming" })

  }

}



export const getOrdersByDelBoy = async (req, res) => {
  try {
    const orders = await Order
      .find({ deliveryBoy: req.params.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const getOrderBgColor = (order) => {
  // If NOT food processing → always green
  if (order.status !== "Food Processing") {
    return "green";
  }

  const now = new Date();
  const createdAt = new Date(order.createdAt);

  const diffMinutes = (now - createdAt) / 60000;

  if (diffMinutes <= 4) return "green";
  if (diffMinutes <= 8) return "yellow";
  return "red";
};






//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
    res.json({ success: true, message: "Status Update" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Status Not Update" })
  }

}

const removeOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    await Order.findByIdAndDelete(id);

    res.json({ success: true, message: "Order removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body; // or from req.params

    const user = await userModel.findById(userId).select(
      "name email age city address phone"
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching user data" });
  }
};


export const fixDelBoyId = async (req, res) => {
  try {
    const result = await Order.updateMany(
      { delBoyId: null, deliveryBoyId: { $ne: null } },
      [{ $set: { delBoyId: "$deliveryBoyId" } }]
    );
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/*const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "orderId and status required"
      });
    }


    // AUTO ASSIGN
    if (status === "Out For Delivery") {
      const boy = await AssignedOrderToDeliveryBoy(orderId);

      if (!boy) {
        return res.json({
          success: false,
          message: "No delivery boy online"
        });
      }

      return res.json({
        success: true,
        message: "Order assigned & out for delivery",
        deliveryBoy: boy
      });
    }

    // NORMAL STATUS UPDATE
    await Order.findByIdAndUpdate(orderId, { status });

    res.json({
      success: true,
      message: "Order status updated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};*/

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "orderId and status required",
      });
    }

    const allowed = [
      "pending",
      "assigned",
      "pickup",
      "out_for_delivery",
      "delivered",
    ];

    if (!allowed.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status value",
      });
    }

    // ✅ AUTO ASSIGN when Out For Delivery
    if (status === "out_for_delivery") {
      const boy = await AssignedOrderToDeliveryBoy(orderId);

      if (!boy) {
        return res.json({
          success: false,
          message: "No delivery boy online",
        });
      }

      // ✅ also update order status in DB
      await Order.findByIdAndUpdate(orderId, { status });

      return res.json({
        success: true,
        message: "Order assigned & out for delivery",
        deliveryBoy: boy,
      });
    }

    // ✅ NORMAL STATUS UPDATE
    await Order.findByIdAndUpdate(orderId, { status });

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};






export const assignPendingOrder = async (delBoyId) => {
  const order = await Order.findOne({
    status: "pending",
    deliveryBoyId: null
  });

  if (!order) return;

  await Order.findByIdAndUpdate(order._id, {
    deliveryBoyId: deliveryBoyId,
    status: "Assigned"
  });

  const boy = await DelBoy.findById(deliveryBoyId);
  io.to(boy.socketId).emit("new-order", order);
};

export const getMyOrderData = async (req, res) => {
  try {
    const { email } = req.body; // gmail entered / stored

    const orders = await Order.find({
      "address.email": email
    });

    if (!orders.length) {
      return res.json({
        success: false,
        message: "No orders found for this email"
      });
    }

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error fetching user data"
    });
  }
};
export const getOrdersByDeliveryBoy = async (req, res) => {
  const orders = await Order.find({
    deliveryBoyId: req.params.id,
  });

  res.json({
    success: true,
    orders,
  });
};

export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await AssignedOrder.find()
      .populate("order")
      .populate("deliveryBoy");

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order
      .findById(id)
      .populate("deliveryBoyId"); // optional

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    .populate("assignedTo", "name number userSpecialId")
    .sort({ createdAt: -1 });

    res.json({
      success: true,          // 🔥 REQUIRED
      data: orders,          // 🔥 REQUIRED
    });
  } catch (err) {
    console.error("LIST ORDERS ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;

    // fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ✅ mark as delivered
    order.status = "delivered";
    order.deliveredAt = new Date(); // ← THIS LINE
    await order.save();            // ← AND THIS LINE

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};


export const listOrdersForStore = async (req, res) => { //old code
  try {
    const { storeId } = req.params;

    if (!storeId) return res.status(400).json({ success: false, message: "storeId required" });

    // Since storeIdRef is string in DB, match as string
    const orders = await Order.find({ "items.storeIdRef": storeId })
      .populate("assignedTo", "name number userSpecialId")
      .sort({ createdAt: -1 });

    // Filter items in each order to include only this store's items
    const filteredOrders = orders.map(order => {
      const itemsForStore = order.items.filter(item => item.storeIdRef === storeId);
      return { ...order._doc, items: itemsForStore };
    });

    if (filteredOrders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this store" });
    }

    res.status(200).json({ success: true, count: filteredOrders.length, data: filteredOrders });
  } catch (err) {
    console.error("LIST ORDERS ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
};/*
export const listOrdersForStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const orders = await Order.find({ "items.storeIdRef": storeId })
      .populate("assignedTo", "name number userSpecialId")
      .sort({ createdAt: -1 });

    const filteredOrders = orders.map((order) => {
      const itemsForStore = order.items.filter(
        (item) => item.storeIdRef === storeId
      );
      return { ...order._doc, items: itemsForStore };
    });

    return res.json({
      success: true,
      data: filteredOrders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};*/




/*
// ✅ USER upload screenshot + create order
export const paymentPendingOrder = async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData) {
      return res.status(400).json({ success: false, message: "orderData missing" });
    }

    const parsedOrder = JSON.parse(orderData);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "paymentScreenshot required" });
    }

    // create order
    const newOrder = new Order({
      userId: req.userId, // make sure your auth middleware sets req.userId
      items: parsedOrder.items,
      amount: parsedOrder.amount,
      address: parsedOrder,
      paymentStatus: "PENDING",
      paymentScreenshot: `uploads/payments/${req.file.filename}`,
      status: "Pending",
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order created & payment pending",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("paymentPendingOrder ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ ADMIN update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    if (!orderId || !paymentStatus) {
      return res.json({ success: false, message: "orderId & paymentStatus required" });
    }

    const allowed = ["PENDING", "SUCCESS", "FAILED"];
    if (!allowed.includes(paymentStatus)) {
      return res.json({ success: false, message: "Invalid payment status" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    order.paymentStatus = paymentStatus;

    // ✅ if payment success -> mark payment true
    if (paymentStatus === "SUCCESS") {
      order.payment = true;
      order.status = "assigned"; // must match enum
    }

    // ❌ if failed -> keep order pending but payment false
    if (paymentStatus === "FAILED") {
      order.payment = false;
      order.status = "pending";
    }

    await order.save();

    res.json({ success: true, message: "Payment status updated", order });
  } catch (err) {
    console.log("PAYMENT STATUS ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ USER check payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderId: order._id,
    });
  } catch (error) {
    console.log("getPaymentStatus ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
*/

// ✅ USER upload screenshot + create order
export const paymentPendingOrder = async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData) {
      return res.status(400).json({ success: false, message: "orderData missing" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "paymentScreenshot required" });
    }

    const parsedOrder = JSON.parse(orderData);

    const newOrder = new Order({
      userId: req.user.id, // authMiddleware sets req.user

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
      paymentScreenshot: req.file.filename, // ✅ only filename
      paymentMethod: "offline",

      payment: false,
      status: "pending",
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Payment uploaded & order saved",
      orderId: newOrder._id,
      order: newOrder,
    });
  } catch (error) {
    console.log("paymentPendingOrder ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADMIN update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    const allowed = ["PENDING", "SUCCESS", "FAILED"];
    if (!allowed.includes(paymentStatus)) {
      return res.json({ success: false, message: "Invalid paymentStatus" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "SUCCESS") {
      order.payment = true;
      order.status = "assigned"; // ✅ valid enum
    }

    if (paymentStatus === "FAILED") {
      order.payment = false;
      order.status = "pending"; // ✅ valid enum
    }

    await order.save();

    res.json({ success: true, message: "Payment status updated", order });
  } catch (error) {
    console.log("updatePaymentStatus ERROR 👉", error);
    res.status(500).json({ success: false, message: error.message });
  }
};/*
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    const allowed = ["PENDING", "SUCCESS", "FAILED"];
    if (!allowed.includes(paymentStatus)) {
      return res.json({ success: false, message: "Invalid paymentStatus" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "SUCCESS") {
      order.payment = true;
      order.status = "assigned"; // ✅ valid
    }

    if (paymentStatus === "FAILED") {
      order.payment = false;
      order.status = "pending"; // ✅ valid
    }

    await order.save();

    res.json({ success: true, message: "Payment status updated", order });  //new add
  } catch (error) {
    console.log("updatePaymentStatus ERROR 👉", error);
    res.status(500).json({ success: false, message: error.message });
  }
};*/


// ✅ USER check payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderId: order._id,
    });
  } catch (error) {
    console.log("getPaymentStatus ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      items,
      amount,
      firstName,
      lastName,
      email,
      city,
      street,
      zipcode,
      linkdata,
      phone,
      age,
      gender,
    } = req.body;

    if (!items || !items.length || !amount) {
      return res.json({ success: false, message: "Missing order data" });
    }

    const newOrder = new Order({
      userId,
      items,
      amount,

      address: {
        firstName,
        lastName,
        email,
        city,
        street,
        zipcode,
        linkdata,
        phone,
        age,
        gender,
        address: street,
      },

      paymentMethod: "offline",     // ✅ your schema enum
      paymentStatus: "PENDING",     // ✅
      payment: false,               // COD = not paid
      status: "pending",            // ✅ schema enum
      paymentScreenshot: "",        // no image
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "COD Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("COD ERROR 👉", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export { placeOrder, updateOrderStatus, verifyOrder, userOrder, listOrders, updateStatus, removeOrder, getUserProfile }

//process.env.RAZORPAY_KEY_ID
//success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
