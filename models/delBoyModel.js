import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
  onlineAt: {
    type: Date,
    required: true
  },
  offlineAt: {
    type: Date,
    default: null
  },
  durationMs: {
    type: Number,
    default: 0 // milliseconds
  }
});


const delBoySchema = new mongoose.Schema(
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

    /* ONLINE / OFFLINE STATUS     status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline"
    },*/
    isActive: {
      type: Boolean,
      default: false
    },

    /** last activity */
    lastSeen: {
      type: Date,
      default: null
    }, 
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    },

    /** total duty time (milliseconds) */
    totalDutyMs: {
      type: Number,
      default: 0
    },

    /** all duty sessions */
    sessions: {
      type: [sessionSchema],
      default: []
    },
    isOnline: {
      type: Boolean,
      default: false
    },

    socketId: String,
  },

  { timestamps: true }
);

const DelBoy =
  mongoose.models.delBoy || mongoose.model("DelBoy", delBoySchema);

export default DelBoy;
