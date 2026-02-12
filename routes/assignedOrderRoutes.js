import express from "express";

import {
  updateOrderStatus,
  cancelOrder,
  assignOrder,
  getMyOrdersForDelBoy,
  getSingleOrder,
  getDelBoyOrderHistory,
  getAllDeliveryInfo,
  deleteDeliveryInfo,
  getLatLngFromLink,
  getAllAssignedOrders,
} from "../controllar/AssignedOrderController.js";
import Order from "../models/orderModel.js";

const assignRouter = express.Router();

assignRouter.post("/assign", assignOrder);
assignRouter.get("/my-orders/:delBoyId", getMyOrdersForDelBoy);
assignRouter.post("/update-status", updateOrderStatus);
assignRouter.post("/cancel", cancelOrder);
assignRouter.get("/order/:orderId", getSingleOrder);
assignRouter.get("/history/:delBoyId", getDelBoyOrderHistory);  //orderHistory sem work not
assignRouter.delete("/history/remove/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    await Order.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order history removed" });
  } catch (err) {
    console.error("DELETE HISTORY ERROR 👉", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
//add new assign data
assignRouter.get("/all", getAllDeliveryInfo);

// ✅ delete
assignRouter.delete("/delete/:id", deleteDeliveryInfo);
//map
assignRouter.post("/extract", getLatLngFromLink);
assignRouter.get("/all", getAllAssignedOrders);
export default assignRouter;

