import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  userId: { type: String, require: true },
  items: { type: Array, require: true },
  
  amount: { type: Number, require: true },
  address: { type: Object, require: true },
  //status: { type: String, default: " Food Processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  lastName: { type: String, require: true },
  firstName: { type: String, require: true },
  phone: { type: Number, require: true },
  street: { type: String, require: true },
  city: { type: String, require: true },
  zipcode: { type: String, require: true },
  linkdata: { type: String, require: true },
  /*address: {
  linkdata: { type: String, required: true },

  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
},*/

  age: { type: String, require: true },
  gender: { type: String, require: true },
  email: { type: String, require: true },
  /*
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DelBoy",   // 🔥 THIS IS REQUIRED
      default: null
    },*/


  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],//add new code status
    default: "PENDING",
  },

  
  paymentScreenshot: { type: String, default: "" }, // 🔥 for uploaded payment image
  paymentMethod: { type: String, enum: ["online", "offline"], default:"" },//last paymentMethod
  status: {
    type: String,
    enum: ["pending", "assigned", "pickup", "out_for_delivery", "delivered"], //just add order
    default: "pending"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,  // or String
    ref: "DelBoy",
    default: null
  },
  /*
  assignedAt: {
    type: Date,
  },*/
}, { timestamps: true, payment: Boolean, })

const Order = mongoose.models.order || mongoose.model("Order", orderSchema)
export default Order;
