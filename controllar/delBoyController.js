import DelBoy from "../models/delBoyModel.js";
import Deliver from "../models/deliverModel.js";
//import Order from "../models/Order.js";
import { io } from "../server.js";



// ✅ GET ALL DELIVERY BOYS
export const getAllDeliveryBoys = async (req, res) => {
  try {
    const data = await DelBoy.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE DELIVERY BOY
export const deleteDeliveryBoy = async (req, res) => {
  try {
    const id = req.params.id;

    await DelBoy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Delivery boy deleted successfully ✅",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


  export const onlineAll= async (req, res) => {
  try {
    const boys = await DelBoy.find({ isOnline: true },{ status: "online" });
    res.json({ success: true, boys });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


export const assignOrderToDeliveryBoy = async (orderId) => {
  const deliveryBoy = await DelBoy.findOne({ isOnline: true });

  if (!deliveryBoy) {
    console.log("❌ No delivery boy online");
    return null;
  }

  const order = await orderId.findByIdAndUpdate(
    orderId,
    {
      deliveryBoyId: deliveryBoy._id,
      status: "Assigned"
    },
    { new: true }
  );

  io.to(deliveryBoy.socketId).emit("new-order", order);

  console.log("✅ Order assigned to:", deliveryBoy._id);

  return deliveryBoy;
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
export const getMe = async (req, res) => {
  const delBoy = await DelBoy.findById(req.user.id);
  res.json(delBoy);
};



export const createDelBoys = async (req, res) => {
  try {
    const { userSpecialId, number, gmail, vehicle } = req.body;

    const deliver = await Deliver.findOne({ userSpecialId });

    if (!deliver) {
      return res.json({
        success: false,
        message: "No delivery data found for this userSpecialId",
      });
    }

    // ✅ STRICT TRUE CHECK
    if (deliver.isActive === true) {
      return res.json({
        success: false,
        message: "Delivery is not active. Ask admin to activate.",
      });
    }

    // ✅ STRING SAFE MATCH
    if (
      String(deliver.number) !== String(number) ||
      deliver.gmail.trim().toLowerCase() !== gmail.trim().toLowerCase() ||
      deliver.vehicle.trim().toLowerCase() !== vehicle.trim().toLowerCase()
    ) {
      return res.json({
        success: false,
        message: "Delivery data does not match.",
      });
    }

    const exists = await DelBoy.findOne({ userSpecialId });
    if (exists) {
      return res.json({
        success: false,
        message: "DelBoy already exists",
      });
    }

    const delBoy = await DelBoy.create({
      name: deliver.name,
      number: deliver.number,
      gmail: deliver.gmail,
      userSpecialId: deliver.userSpecialId,
      vehicle: deliver.vehicle,
      status: "offline",
    });

    res.json({
      success: true,
      message: "DelBoy created successfully",
      data: delBoy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const createDelBoy = async (req, res) => {
  try {
    const { userSpecialId } = req.body;

    // 1️⃣ Find delivery by userSpecialId
    const deliver = await Deliver.findOne({ userSpecialId });

    if (!deliver) {
      return res.json({
        success: false,
        message: "No delivery data found for this userSpecialId",
      });
    }

    // 2️⃣ Delivery must be active
    if (!deliver.isActive) {
      return res.json({
        success: false,
        message: "Delivery is not active. Cannot create DelBoy.",
      });
    }

    // 3️⃣ Prevent duplicate DelBoy
    const exists = await DelBoy.findOne({ userSpecialId });
    if (exists) {
      return res.json({
        success: false,
        message: "DelBoy already exists",
      });
    }

    // 4️⃣ Auto-create DelBoy from delivery data
    const delBoy = await DelBoy.create({
      name: deliver.name,
      number: deliver.number,
      gmail: deliver.gmail,
      userSpecialId: deliver.userSpecialId,
      vehicle: deliver.vehicle,
    });

    return res.json({
      success: true,
      message: "DelBoy created automatically from active delivery",
      data: delBoy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const setOnline = async (req, res) => {
  await DelBoy.findByIdAndUpdate(req.body.id, {
    isOnline: true,status:"online"
  });

  res.json({ success: true });
};
export const setOffline = async (req, res) => {
  await DelBoy.findByIdAndUpdate(req.body.id, {
    isOnline: false,status:"offline"
  });

  res.json({ success: true });
};

export const goOnline = async (req, res) => {
  const { id } = req.body;

  const boy = await DelBoy.findByIdAndUpdate(
    id,
    { isOnline: true },
    { new: true }
  );

  res.json({ success: true, data: boy });
};
export const goOffline = async (req, res) => {
  const { id } = req.body;

  const boy = await DelBoy.findByIdAndUpdate(
    id,
    { isOnline: false },
    { new: true }
  );

  res.json({ success: true, data: boy });
};

export const getAllDelBoy = async (req, res) => {
  const list = await DelBoy.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: list
  });
};


export const removeDelBoy = async (req, res) => {
  await DelBoy.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Removed successfully" });
};
// controllers/delBoyController.js
export const delBoyOnline = async (req, res) => {
  try {
    const { id } = req.body;

    // 1️⃣ Update delBoy
    const delBoy = await DelBoy.findByIdAndUpdate(
      id,
      { isOnline: true, lastSeen: new Date() },
      { new: true }
    );

    if (!delBoy) {
      return res.json({ success: false, message: "DelBoy not found" });
    }

    // 2️⃣ Sync deliver
    await Deliver.findOneAndUpdate(
      { userSpecialId: delBoy.userSpecialId },
      { isOnline: true, lastSeen: delBoy.lastSeen }
    );

    res.json({ success: true, message: "Delivery boy is ONLINE" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
export const delBoyOffline = async (req, res) => {
  try {
    const { id } = req.body;

    // 1️⃣ Update delBoy
    const delBoy = await DelBoy.findByIdAndUpdate(
      id,
      { isOnline: false },
      { new: true }
    );

    if (!delBoy) {
      return res.json({ success: false, message: "DelBoy not found" });
    }

    // 2️⃣ Sync deliver
    await Deliver.findOneAndUpdate(
      { userSpecialId: delBoy.userSpecialId },
      { isOnline: false }
    );

    res.json({ success: true, message: "Delivery boy is OFFLINE" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
export const delBoyProfile = async (req, res) => {
  try {
    const { gmail, userSpecialId } = req.body;

    if (!gmail && !userSpecialId) {
      return res.status(400).json({
        success: false,
        message: "Provide either Gmail or UserSpecialId",
      });
    }

    // Find DelBoy by gmail or userSpecialId
    const delBoy = await DelBoy.findOne({
      $or: [
        { gmail: gmail?.trim().toLowerCase() },
        { userSpecialId: userSpecialId?.trim() },
      ],
    });

    if (!delBoy) {
      return res.status(404).json({
        success: false,
        message: "No DelBoy found with given info",
      });
    }

    res.json({
      success: true,
      message: "DelBoy profile found",
      data: delBoy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getSingleDelBoy = async (req, res) => {
  const { gmail, userSpecialId } = req.body;

  const user = await DelBoy.findOne({ gmail, userSpecialId });

  if (!user) {
    return res.json({
      success: false,
      message: "Delivery boy not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
};

export const updateStatus = async (req, res) => {
  const { boyId, isOnline } = req.body;

  await DelBoy.findByIdAndUpdate(boyId, { isOnline });

  res.json({ success: true });
};

// Get online boys
export const getOnlineBoys = async (req, res) => {
  const boys = await DelBoy.find({ isOnline: true });
  res.json(boys);
};
