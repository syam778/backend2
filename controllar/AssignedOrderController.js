
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import DelBoy from "../models/delBoyModel.js";
import AssignedOrder from "../models/AssignedOrderModel.js";
import { io } from "../server.js"; // adjust path if needed









const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
const calculateDeliveryCharge = (distanceKm, itemSizeUnit, itemSizeValue) => {
  let charge = 10;

  // ✅ Distance rule
  if (distanceKm > 2) {
    const extraKm = Math.ceil(distanceKm - 2);
    charge += extraKm * 8;
  }

  // ✅ Item size rule
  if (itemSizeUnit === "pcs") {
    if (itemSizeValue > 5) {
      charge += (itemSizeValue - 5) * 5;
    }
  }

  if (itemSizeUnit === "kg") {
    if (itemSizeValue > 5) {
      charge += Math.ceil((itemSizeValue - 5) / 5) * 5;
    }
  }

  return charge;
};
/*export const assignOrder = async (req, res) => {
  try {
    const { orderId, deliveryBoyId, linkdata } = req.body;

    if (!orderId || !deliveryBoyId || !linkdata) {
      return res.status(400).json({
        success: false,
        message: "orderId, deliveryBoyId, storeLinkdata required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const delBoy = await DelBoy.findById(deliveryBoyId);
    if (!delBoy) {
      return res.status(404).json({ success: false, message: "Delivery boy not found" });
    }

    // prevent duplicate assignment
    const exists = await AssignedOrder.findOne({ order: orderId });
    if (exists) {
      return res.status(400).json({ success: false, message: "Order already assigned" });
    }

    // ✅ user linkdata from order
    const userLatLng = extractLatLng(order.linkdata);
    if (!userLatLng) {
      return res.status(400).json({
        success: false,
        message: "Invalid USER Google map link",
      });
    }

    // ✅ store linkdata from req.body
    const storeLatLng = extractLatLng(linkdata);
    if (!storeLatLng) {
      return res.status(400).json({
        success: false,
        message: "Invalid STORE Google map link",
      });
    }

    // ✅ distance
    const distanceKm = haversineDistanceKm(
      storeLatLng.lat,
      storeLatLng.lng,
      userLatLng.lat,
      userLatLng.lng
    );

    // ✅ itemSize from first item
    const firstItem = order.items?.[0];
    const unit = firstItem?.itemSize?.unit || "pcs";
    const size = Number(firstItem?.itemSize?.size || 0);

    // ✅ delivery charge
    const deliveryCharge = calculateDeliveryCharge(distanceKm, unit, size);

    // ✅ Create assigned order (ONLY basic)
    const assignedOrder = await AssignedOrder.create({
      order: order._id,
      deliveryBoyId: delBoy._id,
      status: "assigned",
      deliveryCharge,
      distanceKm: Number(distanceKm.toFixed(2)),
    });

    // update main order
    order.status = "assigned";
    order.assignedTo = delBoy._id;
    order.deliveryCharge = deliveryCharge;
    order.distanceKm = Number(distanceKm.toFixed(2));
    await order.save();

    return res.json({
      success: true,
      message: "Order assigned with delivery charge",
      data: assignedOrder,
      distanceKm: Number(distanceKm.toFixed(2)),
      deliveryCharge,
    });
  } catch (err) {
    console.error("ASSIGN ORDER ERROR 👉", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};*/






export const extractLatLng = (url) => {
  if (!url) return null;

  // ✅ Pattern 1: !3dLAT!4dLNG (best)
  const match1 = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (match1) {
    return {
      lat: parseFloat(match1[1]),
      lng: parseFloat(match1[2]),
    };
  }

  // ✅ Pattern 2: @LAT,LNG (works in many links)
  const match2 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match2) {
    return {
      lat: parseFloat(match2[1]),
      lng: parseFloat(match2[2]),
    };
  }

  return null;
};
export const getDelBoyHistory = async (req, res) => {
  try {
    const { delBoyId } = req.params;

    const history = await AssignedOrder.find({ deliveryBoyId: delBoyId })
      .sort({ createdAt: -1 })
      .populate("order") // 🔥 brings full order details
      .populate("deliveryBoyId", "name userSpecialId");

    return res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.log("HISTORY ERROR:", error);
    res.json({ success: false, message: "Server error" });
  }
};



export const getLatLngFromLink = async (req, res) => {
  try {
    const { linkdata } = req.body;

    if (!linkdata) {
      return res.json({
        success: false,
        message: "Google map link is required",
      });
    }

    const result = extractLatLng(linkdata);

    if (!result) {
      return res.json({
        success: false,
        message: "Invalid Google Maps link (lat/lng not found)",
      });
    }

    return res.json({
      success: true,
      lat: result.lat,
      lng: result.lng,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// Get all orders assigned to a specific delivery boy
export const getMyAssignedOrders = async (req, res) => {
  const { userId } = req.params; // delivery boy _id from frontend

  try {
    // Fetch assigned orders for this delivery boy
    // ✅ Use the correct field name: deliveryBoyId (matches your AssignedOrder schema)
    const orders = await AssignedOrder.find({ deliveryBoyId: userId })
      .populate("order") // populate full order details
      .sort({ assignedAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders assigned" });
    }

    // Only send the order documents to frontend
    const orderData = orders.map(a => a.order);

    res.json({ success: true, data: orderData });
  } catch (err) {
    console.error("GET MY ASSIGNED ORDERS ERROR 👉", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyOrdersForDelBoy = async (req, res) => {
  const { delBoyId } = req.params;

  const orders = await Order.find({ assignedTo: delBoyId })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
};


// this code main code
export const assignOrder = async (req, res) => { //main code
  try {
    const { orderId, deliveryBoyId } = req.body;

    if (!orderId || !deliveryBoyId) {
      return res.status(400).json({ success: false, message: "orderId and deliveryBoyId required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const delBoy = await DelBoy.findById(deliveryBoyId);
    if (!delBoy) return res.status(404).json({ success: false, message: "Delivery boy not found" });

    // prevent duplicate assignment
    const exists = await AssignedOrder.findOne({ order: orderId });
    if (exists) return res.status(400).json({ success: false, message: "Order already assigned" });

    const assignedOrder = await AssignedOrder.create({
      order: order._id,
      deliveryBoyId: delBoy._id, // ✅ FIXED
      status: "assigned",
    });

    // update main order
    order.status = "assigned"; //s
    order.assignedTo = delBoy._id;
    await order.save();

    res.json({ success: true, data: assignedOrder });
  } catch (err) {
    console.error("ASSIGN ORDER ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




export const cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  await AssignedOrder.findOneAndDelete({ order: orderId });

  await Order.findByIdAndUpdate(orderId, { status: "cancelled" });

  res.json({ success: true });
};

export const getMyOrders = async (req, res) => {
  try {
    const { userSpecialId } = req.params;

    // Find delivery boy
    const deliveryBoy = await DelBoy.findOne({ userSpecialId });
    if (!deliveryBoy) {
      return res.json({
        success: false,
        message: "Delivery boy not found",
      });
    }

    // Find orders assigned to this delivery boy
    const orders = await Order.find({
      assignedTo: deliveryBoy._id,   // 🔥 CORE LOGIC
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error("GET MY ORDERS ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getAllDeliveryBoyTotals = async (req, res) => {
  try {
    const deliveryBoys = await DelBoy.find();

    const result = [];

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

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("GET TOTALS ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// AssignedOrderController.js
export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    // Fetch from main Order collection
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error("GET SINGLE ORDER ERROR 👉", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
//delboy(id)order history
/*export const orderHistory = async (req, res) => {
  const { delBoyId } = req.params;

  try {
    // Check if delivery boy exists
    const delBoy = await DelBoy.findById(delBoyId);
    if (!delBoy) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery boy not found" });
    }

    // Get all orders assigned to this delivery boy
    const orders = await Order.find({ deliveryBoy: delBoy._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("ORDER HISTORY ERROR 👉", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};*/


export const getAllAssignedOrders = async (req, res) => {
  try {
    const data = await AssignedOrder
      .find()
      .populate("deliveryBoyId") // ✅ this will return full delivery boy data
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getDelBoyOrderHistory = async (req, res) => {
  try {
    const { delBoyId } = req.params;

    const history = await AssignedOrder.find({
      deliveryBoyId: delBoyId
    })
      .populate({
        path: "order",
        populate: {
          path: "items.product", // optional (if you have product ref)
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("DELBOY HISTORY ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
    });
  }
};




// ✅ GET ALL DELIVERY INFO
export const getAllDeliveryInfo = async (req, res) => {
  try {
    const data = await AssignedOrder.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE DELIVERY INFO
export const deleteDeliveryInfo = async (req, res) => {
  try {
    const id = req.params.id;

    await AssignedOrder.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Delivery info deleted successfully ✅",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
