import adminModel from "../models/adminModel.js";

//🔐 Allowed usernames from .env *
const ALLOWED_ADMINS = [
  process.env.ADMIN_NAME1,
  process.env.ADMIN_NAME2
];

export const createAdmin = async (req, res) => {
  try {
    const { admincode, number, gmail, username } = req.body;

    if (!admincode || !number || !gmail || !username) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔒 ENV-BASED USERNAME VALIDATION
    if (!ALLOWED_ADMINS.includes(username)) {
      return res.status(403).json({
        success: false,
        message: "NOT ENTRY ❌ (Unauthorized Admin Username)"
      });
    }

    const exists = await adminModel.findOne({
      $or: [{ admincode }, { number }, { gmail }]
    });

    if (exists) {
      return res.json({
        success: false,
        message: "Admin already exists"
      });
    }

    const admin = await adminModel.create({
      admincode,
      number,
      gmail,
      username
    });

    res.json({
      success: true,
      message: "Admin created successfully",
      data: admin
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        message: "Admin ID is required"
      });
    }

    const admin = await adminModel.findById(id);

    if (!admin) {
      return res.json({
        success: false,
        message: "Admin not found"
      });
    }

    await adminModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Admin removed successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

 
export const getAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findOne({
      username: { $in: ALLOWED_ADMINS }
    });

    if (!admin) {
      return res.json({
        success: false,
        message: "Admin not found"
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const adminAuth = (req, res, next) => {
  const { username } = req.body;

  if (!ALLOWED_ADMINS.includes(username)) {
    return res.status(403).json({
      success: false,
      message: "NOT ENTRY ❌ Admin Only"
    });
  }

  next();
};

/*import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* 🔐 Allowed Admin Usernames *
const ALLOWED_ADMINS = [
  process.env.ADMIN_NAME1,
  process.env.ADMIN_NAME2
];

/* 🔑 Create Token *
const createAdminToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "365d" });
};
export const createAdmin = async (req, res) => {
  try {
    const { admincode, number, gmail, username, password } = req.body;

    if (!admincode || !number || !gmail || !username || !password) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔒 ENV Username Check
    if (!ALLOWED_ADMINS.includes(username)) {
      return res.status(403).json({
        success: false,
        message: "NOT ENTRY ❌ Unauthorized Admin Username"
      });
    }

    const exists = await adminModel.findOne({
      $or: [{ gmail }, { number }, { username }]
    });

    if (exists) {
      return res.json({
        success: false,
        message: "Admin already exists"
      });
    }

    // 🔐 Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await adminModel.create({
      admincode,
      number,
      gmail,
      username,
      password: hashedPassword
    });

    const token = createAdminToken(admin._id);

    res.json({
      success: true,
      message: "Admin created successfully",
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!ALLOWED_ADMINS.includes(username)) {
      return res.status(403).json({
        success: false,
        message: "NOT ENTRY ❌ Admin Only"
      });
    }

    const admin = await adminModel.findOne({ username });

    if (!admin) {
      return res.json({
        success: false,
        message: "Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = createAdminToken(admin._id);

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};
export const getAdmin = async (req, res) => {
  try {
    // req.admin set by adminAuth middleware
    const admin = req.admin;

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        gmail: admin.gmail,
        number: admin.number
      }
    });

  } catch (error) {
    console.error("Get Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};*/