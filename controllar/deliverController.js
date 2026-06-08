
import Deliver from "../models/deliverModel.js"; // ✅


/*export const verifyUser = async (req, res) => {//old code
  try {
    console.log("BODY:", req.body);

    const { gmail, number, userSpecialId } = req.body;

    const deliver = await Deliver.findOne({
      gmail: gmail.trim().toLowerCase(),
      userSpecialId: userSpecialId.trim(),
    });

    console.log("FOUND:", deliver);

    if (!deliver) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy not found",
      });
    }

    if (String(deliver.number) !== String(number)) {
      return res.status(400).json({
        success: false,
        message: "Phone number does not match",
      });
    }

    return res.json({
      success: true,
      data: deliver,
    });

  } catch (error) {
    console.log("BACKEND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};*/

export const verifyUser = async (req, res) => {
  try {
    let { gmail, number, userSpecialId } = req.body;

    console.log("Received Data:", req.body);

    // Validation
    if (!gmail || !number || !userSpecialId) {
      return res.status(400).json({
        success: false,
        message: "Gmail, Phone Number and User Special ID are required",
      });
    }

    // Normalize values
    gmail = gmail.trim().toLowerCase();
    number = String(number).trim();
    userSpecialId = userSpecialId.trim();

    // Find delivery boy
    const user = await Deliver.findOne({
      gmail,
      userSpecialId,
    });

    console.log("Found User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Delivery Boy not found",
      });
    }

    // Compare phone number
    if (String(user.number).trim() !== number) {
      return res.status(400).json({
        success: false,
        message: "Phone number does not match",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification successful",
      data: user,
    });

  } catch (error) {
    console.error("Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



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


export const getAllDeliver = async (req, res) => {
  try {
    const delivers = await Deliver.find().sort({ createdAt: -1 });
    res.json({ success: true, data: delivers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



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

