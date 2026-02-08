import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    admincode: {
      type: String,
      required: true,
      unique: true
    },

    number: {
      type: String,
      required: true,
      unique: true
    },

    gmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    username: {
      type: String,
      required: true
      
    }
  },
  { timestamps: true }
);

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel; //main code
/*

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    admincode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
      unique: true,
    },

    gmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: "admin", // 🔥 important
    },
  },
  { timestamps: true }
);

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
*/