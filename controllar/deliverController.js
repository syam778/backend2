//import Deliver from "../models/Deliver.js";

//import Deliver from "../models/deliverModel";
import Deliver from "../models/deliverModel.js"; // ✅



/* ➕ Create Delivery Boy */
export const createDeliver = async (req, res) => {
  try {
    const { name, number, gmail, userSpecialId, vehicle } = req.body;

    if (!name || !number || !gmail || !userSpecialId || !vehicle) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    // check existing delivery boy
    const exists = await Deliver.findOne({
      $or: [{ number }, { gmail }, { userSpecialId }]
    });

    if (exists) {
      return res.json({
        success: false,
        message: "Delivery boy already exists"
      });
    }

    const newDeliver = await Deliver.create({
      name,
      number,
      gmail,
      userSpecialId,
      vehicle
    });

    res.json({
      success: true,
      message: "Delivery boy created successfully",
      data: newDeliver
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




/* ❌ Remove Delivery Boy */
export const removeDeliver = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        message: "Delivery boy ID is required"
      });
    }

    const deliver = await Deliver.findById(id);

    if (!deliver) {
      return res.json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    await Deliver.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Delivery boy removed successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* 📄 Get All Delivery Boys *
export const getAllDeliver = async (req, res) => {
  try {
    const delivers = await Deliver.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: delivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};*/
export const getAllDeliver = async (req, res) => {
  try {
    const delivers = await Deliver.find().sort({ createdAt: -1 });
    res.json({ success: true, data: delivers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* 🟢 Set Delivery Boy Online 
export const deliverOnline = async (req, res) => {
  try {
    const { id } = req.body;

    await Deliver.findByIdAndUpdate(id, {
      isOnline: true,
      lastSeen: new Date()
    });

    res.json({ success: true, message: "Delivery boy is online" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
*/

// deliveryController.js
/*export const deliverOnline = async (req, res) => {
  const { userSpecialId } = req.body;

  const delivery = await Deliver.findOneAndUpdate(
    { userSpecialId },
    { isActive: true },
    { new: true }
  );

  // 🔥 AUTO CREATE DELBOY
  await createDelBoys(
    { body: { 
        userSpecialId,
        number: delivery.number,
        gmail: delivery.gmail,
        vehicle: delivery.vehicle
    }},
    { json: () => {} }
  );

  res.json({ success: true, message: "Delivery is now online" });
};

/* Set Delivery Boy Offline 
export const deliverOffline = async (req, res) => {
  try {
    const { id } = req.body;

    await Deliver.findByIdAndUpdate(id, {
      isOnline: false
    });

    res.json({ success: true, message: "Delivery boy is offline" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

*/



/* 🟢 SET DELIVERY ONLINE (ADMIN) */
export const deliverOnline = async (req, res) => {
  try {
    const { id } = req.body;

    const deliver = await Deliver.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },{ status: "online" }//add 88
    );

    if (!deliver) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.json({
      success: true,
      message: "Delivery set to ONLINE",
      data: deliver,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* 🔴 SET DELIVERY OFFLINE (ADMIN) */
export const deliverOffline = async (req, res) => {
  try {
    const { id } = req.body;

    const deliver = await Deliver.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deliver) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    res.json({
      success: true,
      message: "Delivery set to OFFLINE",
      data: deliver,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/deliverController.js
export const activateDeliver = async (req, res) => {
  const { id } = req.body;

  await Deliver.findByIdAndUpdate(id, {
    isActive: true
  });

  res.json({ success: true, message: "Delivery activated" });
};

// GET /api/delivery/online
export const getOnlineDeliveryBoys = async (req, res) => {
  try {
    const boys = await Deliver.find({ isOnline: true });

    res.json({
      success: true,
      data: boys,
     isActive: true 

    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
/*export const setOnline = async (req, res) => {
  const { deliveryBoyId } = req.body;

  await Deliver.findByIdAndUpdate(deliveryBoyId, {
    isOnline: true
  });

  res.json({ success: true });
};
export const setOffline = async (req, res) => {
  const { deliveryBoyId } = req.body;

  await Deliver.findByIdAndUpdate(deliveryBoyId, {
    isOnline: false
  });

  res.json({ success: true });
};*/
// delBoyController.js

/* =========================
   SET ONLINE
========================= */
export const setOnline = async (req, res) => {
  try {
    await Deliver.findByIdAndUpdate(req.body.id, {
      isOnline: true, status: "online"
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   SET OFFLINE
========================= */
export const setOffline = async (req, res) => {
  try {
    await Deliver.findByIdAndUpdate(req.body.id, {
      isOnline: false, status: "offline"
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

