
import mongoose from "mongoose";

const inputSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    storeName: {
      type: String,
      required: true,
      unique: true,     // ✅ UNIQUE
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    linkdata: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    street: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true }
);

// 🔥 helpful index
inputSchema.index({ email: 1, phone: 1 });

const inputModel =
  mongoose.models.input || mongoose.model("input", inputSchema);

export default inputModel;
