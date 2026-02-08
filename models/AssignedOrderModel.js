import mongoose from "mongoose";

const assignedOrderSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "DelBoy", required: true },
    status: {
      type: String,
      enum: [
        "assigned","pickup","out for delivery","delivered","cancelled",],
      default: "assigned",
    },
    assignedAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const AssignedOrder = mongoose.models.AssignedOrder || mongoose.model("AssignedOrder", assignedOrderSchema);

export default AssignedOrder;
