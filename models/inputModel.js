/*import mongoose from "mongoose";
import { type } from "os";

const inputSchema = new mongoose.Schema(
  {
    fullName: {required: true,type:String},
    storeName: {required: true,type:String,unique: true, trim: true},
    email: { type: String, required: true, unique: true,lowercase: true, trim: true },
    city: {required: true,type:String},
    linkdata: {required: true,type:String},
    zipcode: {required: true,type:Number},
    address: {required: true,type:String},
    street:{required: true,type:String},
    phone: {type:String,trim: true,required: true, unique: true,},
    age: {required: true,type:Number},
    gender: {required: true,type:String},
  },
  { timestamps: true }
);

const inputModel = mongoose.models.input || mongoose.model("input",inputSchema);

export default inputModel;

*/

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
