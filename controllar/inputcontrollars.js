import inputModel from "../models/inputModel.js";

export const verifyUser = async (req, res) => {
  try {
    let { email, phone, storeName } = req.body;

    if (!email || !phone || !storeName) {
      return res.status(400).json({
        success: false,
        message: "Email, phone, and store name are required",
      });
    }

    email = email.trim().toLowerCase();
    phone = phone.trim();
    storeName = storeName.trim();

    const user = await inputModel.findOne({
      email,
      phone,
      storeName,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User data does not match",
      });
    }

    res.status(200).json({
      success: true,
      userId: user._id,
      email: user.email,
      phone: user.phone,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    let userData = req.body;

    // ✅ required fields
    if (!userData.email || !userData.phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
      });
    }

    // ✅ normalize data BEFORE save
    userData.email = userData.email.trim().toLowerCase();
    userData.phone = userData.phone.toString().trim();

    // ✅ prevent duplicate user
    const exists = await inputModel.findOne({
      email: userData.email,
      phone: userData.phone,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ create user
    const user = new inputModel(userData);
    await user.save();

    // ✅ success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user._id,
      email: user.email,
      phone: user.phone,
    });

  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating user",
    });
  }
};


export const userProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
      });
    }

    // Find user
    const user = await inputModel.findOne({
      email: email.trim().toLowerCase(),
      phone: phone.trim()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email and phone",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile found",
      data: user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
//duplicate userprofile name chenge only
export const userProfilenano = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
      });
    }

    // Find user
    const user = await inputModel.findOne({
      email: email.trim().toLowerCase(),
      phone: phone.trim()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email and phone",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile found",
      data: user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify user by email & phone only

export const createDelProfileUser = async (req, res) => {
  try {
    let { email, phone } = req.body;

    // ✅ normalize
    email = email.trim().toLowerCase();
    phone = phone.toString().trim();

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
      });
    }

    // 🔥 IMPORTANT: if phone is Number in DB
    const user = await inputModel.findOne({
      email,
      phone: Number(phone),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      userData: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

