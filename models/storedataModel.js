

import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true, index: true },
    storeName: { type: String, required: true, trim: true },
    storeId: { type: String, required: true, unique: true, trim: true },
    gmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please use a valid Indian phone number"],
    },
    age: { type: Number, required: true, min: 18, max: 100 },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    linkdata: { type: String, required: true },
    /*address: {
  linkdata: { type: String, required: true },

  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
},*/

    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, "Please use a valid pincode"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const StoreData = mongoose.models.StoreData || mongoose.model("StoreData", storeSchema);

export default StoreData;
