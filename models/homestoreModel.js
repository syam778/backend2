import mongoose from "mongoose";

// Optional: session schema for store activity, if needed
const storeSessionSchema = new mongoose.Schema({
  loginAt: {
    type: Date,
    required: true
  },
  logoutAt: {
    type: Date,
    default: null
  },
  durationMs: {
    type: Number,
    default: 0
  }
});

const homeStoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      type: String,
      default: ""
    },

    userSpecialId: {
      type: String,
      required: true,
      unique: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastSeen: {
      type: Date,
      default: null
    },

    totalDutyMs: {
      type: Number,
      default: 0
    },

    sessions: {
      type: [storeSessionSchema],
      default: []
    },

    isOnline: {
      type: Boolean,
      default: false
    },

    socketId: String
  },
  { timestamps: true }
);

const HomeStoreModel =
  mongoose.models.HomeStore || mongoose.model("HomeStore", homeStoreSchema);

export default HomeStoreModel;
