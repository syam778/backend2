/*import mongoose from "mongoose";

const storeVerifySchema = new mongoose.Schema(
  {
    username: { type: String, required: true ,unique: true,},
    storeId: { type: String, required: true ,unique: true,},
    gmail: { type: String, required: true,unique: true, },
    phone: { type: String, required: true,unique: true, },

    address: { type: String, required: true },
    street: { type: String, required: true },
    pincode: { type: String, required: true },
    

    status: {
      type: String,
      enum: ["verified", "failed"],
      default: "failed",
    },

    storeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreData",
    },
  },
  { timestamps: true }
);

const StoreVerify = mongoose.models.StoreVerify || mongoose.model("StoreVerify", storeVerifySchema);

export default StoreVerify;
*/

import mongoose from "mongoose";

const logicstoreSchema = new mongoose.Schema(
  {
    username: { type: String, required: true ,unique: true,},
    storeId: { type: String, required: true ,unique: true,},
    gmail: { type: String, required: true,unique: true, },
    phone: { type: String, required: true,unique: true, },

    address: { type: String, required: true },
    street: { type: String, required: true },
    pincode: { type: String, required: true },
    

    status: {
      type: String,
      enum: ["verified", "failed"],
      default: "failed",
    },

    storeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreData",
    },
  },
  { timestamps: true }
);

const Logicstore = mongoose.models.logicstore || mongoose.model("Logicstore", logicstoreSchema);

export default Logicstore;