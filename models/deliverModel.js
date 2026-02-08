/*import mongoose from "mongoose";

const deliverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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

    userSpecialId: {
      type: String,
      required: true,
      unique: true
    },

    vehicle: {
      type: String,
      enum: ["Bike", "Scooter", "Cycle", "Car"],
      required: true
    },

    isOnline: {
      type: Boolean,
      default: false
    },

    lastSeen: {
      type: Date,
      default: null
    },
    // models/deliverModel.js
    isActive: {
      type: Boolean,
      default: false
    },
    isOnline: {
      type: Boolean,
      default: false
    },

    socketId: String,
    totalDutyMs: { type: Number, default: 0 },

  },
  { timestamps: true }
);

const Deliver = mongoose.models.deliver || mongoose.model("Deliver", deliverSchema);
export default Deliver

*/
import mongoose from "mongoose";

const deliverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    gmail: { type: String, required: true },
    userSpecialId: { type: String, required: true ,unique: true},
    vehicle: { type: String, required: true },

    isOnline: { type: Boolean, default: false },
    status: { type: String, default: "offline" },
    isActive: { type: Boolean, default: false },
    socketId: String,
    totalDutyMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔴 This line PREVENTS OverwriteModelError
const Deliver =
  mongoose.models.Deliver || mongoose.model("Deliver", deliverSchema);

export default Deliver;
