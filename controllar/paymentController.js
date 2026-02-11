import Payment from "../models/paymentModel.js";



const UPI_ID = "beherasyam28-2@oksbi"; // your UPI

export const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid orderId or amount" });
    }

    const paymentId = "PAY_" + Date.now();

    // Generate UPI URL
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Syama%20Sundar&am=${amount}&cu=INR`;

    const payment = await Payment.create({
      paymentId,
      orderId,
      amount,
      upiUrl,
      status: "CREATED",
    });

    res.status(201).json({
      success: true,
      message: "Payment created",
      payment,
    });
  } catch (error) {
    console.error("CreatePayment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentId });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ GET PAYMENT STATUS
/*export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({ success: true, payment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
*/
// ✅ WEBHOOK (SIMULATOR WILL CALL THIS)
export const paymentWebhook = async (req, res) => {
  try {
    const { paymentId, status, utr } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({
        success: false,
        message: "paymentId and status required",
      });
    }

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.status = status;

    if (utr) payment.utr = utr;

    await payment.save();

    return res.json({
      success: true,
      message: "Payment updated by webhook",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
