


import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },

    firstName: { type: String, required: true },
    phone: { type: Number, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    linkdata: { type: String, required: true, },
    /*address: {
      linkdata: { type: String, required: true },

      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },*/
    itemSize: {
      unit: { type: String, enum: ["gm", "kg", "ml", "ltr", "pcs"], default: "gm" },
      size: { type: Number, default: 1 }
    },



    // 🏪 Store ID (required only for store)
    storeIdRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "storedata",
      default: null,
      validate: {
        validator: function (value) {
          // If store → storeIdRef REQUIRED
          if (this.createdBy === "store") {
            return value !== null;
          }
          // If admin → storeIdRef MUST be null
          return value === null;
        },
        message:
          "storeIdRef is required for store and must be null for admin"
      }
    },

    // 🔥 Creator
    createdBy: {
      type: String,
      enum: ["store", "admin"],
      required: true
    }
  },
  { timestamps: true }
);

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;

