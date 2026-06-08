import Order from "../models/orderModel.js";
import StoreData from "../models/storedataModel.js"; // Mongoose model

 const createStore = async (req, res) => {
  try {
    const store = await StoreData.create(req.body);

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: store,
    });
  } catch (error) {
    // Handle duplicate key errors (username, email, phone, storeId)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const getAllStores = async (req, res) => {
  try {
    const stores = await StoreData.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 const getSingleStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await StoreData.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const removeStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await StoreData.findByIdAndDelete(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Store removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 const checkStoreUser = async (req, res) => {
  try {
    const { username, gmail } = req.body;

    if (!username && !gmail) {
      return res.status(400).json({
        success: false,
        message: "Username or Gmail is required",
      });
    }

    const existingStore = await StoreData.findOne({
      $or: [
        { username: username?.trim() },
        { gmail: gmail?.trim().toLowerCase() },
      ],
    });

    if (existingStore) {
      return res.status(200).json({
        success: true,
        message: "User exists",
        data: existingStore,
      });
    }

    return res.status(200).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    console.error("Check store error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// new data


// Get store by phone or email
export const getStore = async (req, res) => {
  try {
    const { phone, email } = req.query;

    if (!phone && !email) {
      return res
        .status(400)
        .json({ success: false, message: "Provide phone or email" });
    }

    // Find store
    const store = await StoreData.findOne(
      phone ? { phone } : { email }
    );

    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    res.status(200).json({ success: true, data: store });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
export const verifyUser = async (req, res) => {
  try {
    let { email, phone, storeName } = req.body;

    if (!email || !phone || !storeName) {
      return res.status(400).json({
        success: false,
        message: "Email, phone and storeName are required",
      });
    }

    email = email.trim().toLowerCase();
    phone = phone.trim();
    storeName = storeName.trim();

    const user = await StoreData.findOne({
      email,
      phone,
      storeName,
    });

    console.log("Search Data:", {
      email,
      phone,
      storeName,
    });

    console.log("Found User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: user,
    });

  } catch (error) {
    console.error("Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export {checkStoreUser,createStore,removeStore,getSingleStore,getAllStores};;