import orderModel from "../models/orderModel.js";
import deliverModel from "../models/deliverModel.js";
import delBoyModel from "../models/delBoyModel.js";

export const autoAssignOrder = async (orderId) => {
  setTimeout(async () => {
    const onlineBoy = await deliverModel.findOne({ isOnline: true });

    if (!onlineBoy) {
      console.log("❌ No delivery boy online");
      return;
    }

    await orderModel.findByIdAndUpdate(orderId, {
      //deliveryBoyId: onlineBoy._id,
      deliveryBoyId: ObjectId,
      status: "Out For Delivery"
    });

    console.log("✅ Order auto-assigned to:", onlineBoy._id);
    

  }, 60 * 1000); // 1 minute
};
/*
export const autoAssignOrder = async (orderId) => {
  setTimeout(async () => {
    // 🔹 Pick only online delivery boy
    const onlineBoy = await delBoyModel.findOne({ isOnline: true });

    if (!onlineBoy) {
      console.log("❌ No delivery boy online, order not assigned");
      return;
    }

    // 🔹 Assign order to this online delivery boy
    await orderModel.findByIdAndUpdate(orderId, {
      deliveryBoyId: onlineBoy._id,//ordermodel
      status: "assigned"
    });
    


    console.log("✅ Order auto-assigned to:", onlineBoy._id);
  }, 60 * 1000); // 1 min delay
  
};
*/

// controllers/orderController.js

