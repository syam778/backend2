
import StoreData from "../models/storedataModel.js";
import StoreVerify from "../models/storeVerifyModel.js";


// ✅ GET ALL
export const getAllStoreInfo = async (req, res) => {
  try {
    const data = await StoreVerify.find().sort({ createdAt: -1 });

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

// ✅ DELETE
export const deleteStoreInfo = async (req, res) => {
  try {
    const id = req.params.id;

    await StoreVerify.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "StoreInfo deleted successfully ✅",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyStore = async (req, res) => {
  try {
    const {
      username,
      storeId,
      gmail,
      phone,
      address,
      street,
      pincode,
    } = req.body;

    /* ================= FIND STORE DATA ================= */
    const store = await StoreData.findOne({
      username,
      storeId,
      gmail,
      phone,
      address,
      street,
      pincode,
    });

    /* ================= STORE VERIFY RECORD ================= */
    if (!store) {
      const failedVerify = await StoreVerify.create({
        username,
        storeId,
        gmail,
        phone,
        address,
        street,
        pincode,
        status: "failed",
      });

      return res.status(404).json({
        success: false,
        message: "Store verification failed. Data not matched.",
        data: failedVerify,
      });
    }

    /* ================= SUCCESS ================= */
    const verifiedStore = await StoreVerify.create({
      username,
      storeId,
      gmail,
      phone,
      address,
      street,
      pincode,
      status: "verified",
      storeRef: store._id,
    });

    return res.status(200).json({
      success: true,
      message: "Store verified successfully",
      data: verifiedStore,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const quickVerifyStore = async (req, res) => {
  try {
    const { username, storeId, gmail, phone } = req.body;

    if (!username || !storeId || !gmail || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, storeId, gmail, and phone",
      });
    }

    // Check if store already verified
    const verifiedStore = await StoreVerify.findOne({
      username: username.trim(),
      storeId: storeId.trim(),
      gmail: gmail.trim().toLowerCase(),
      phone: phone.trim(),
      status: "verified",
    });

    if (verifiedStore) {
      return res.status(200).json({
        success: true,
        message: `✅ Welcome ${verifiedStore.username}! Your store is verified.`,
        data: verifiedStore,
      });
    }

    // If no verified record → check in original StoreData
    const store = await StoreData.findOne({
      username: username.trim(),
      storeId: storeId.trim(),
      gmail: gmail.trim().toLowerCase(),
      phone: phone.trim(),
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "❌ Store not found. Please check your details.",
      });
    }

    // Create a verified record automatically (optional)
    const newVerify = await StoreVerify.create({
      username: store.username,
      storeId: store.storeId,
      gmail: store.gmail,
      phone: store.phone,
      address: store.address || "",
      street: store.street || "",
      pincode: store.pincode || "",
      status: "verified",
      storeRef: store._id,
    });

    return res.status(200).json({
      success: true,
      message: `✅ Welcome ${newVerify.username}! Your store is verified.`,
      data: newVerify,
    });

  } catch (error) {
    console.error("Quick verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
