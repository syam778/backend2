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
export {checkStoreUser,createStore,removeStore,getSingleStore,getAllStores};;