import express from "express"
import authMiddleware from "../middleware/auth.js"
//import { placeOrder,verifyOrder } from "../controllers/orderControllar.js"
//import orderController from './controllers/ordercontroller.js';
import { listOrders, placeOrder, updateStatus, userOrder, verifyOrder } from "../controllar/ordercontrollar.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrder)
orderRouter.get("/list",listOrders)
orderRouter.post("/status",updateStatus)

export default orderRouter;