/*import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true },

    orderId: { type: String, required: true },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED"],
      default: "CREATED",
    },

    utr: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
*/
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED"],
      default: "CREATED",
    },
    utr: { type: String, default: "" },
    upiUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
