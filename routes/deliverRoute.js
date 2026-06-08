import express from "express";
import { activateDeliver, createDeliver, deliverOffline, deliverOnline, getAllDeliver, getOnlineDeliveryBoys, removeDeliver, setOffline, setOnline, verifyUser,  } from "../controllar/deliverController.js";


const deliverRouter = express.Router();

deliverRouter.post("/create",createDeliver );
deliverRouter.post("/verify",verifyUser); //not working
deliverRouter.get("/get", getAllDeliver);
deliverRouter.post("/online", deliverOnline);
deliverRouter.post("/offline", deliverOffline);
deliverRouter.delete("/delete/:id", removeDeliver);
deliverRouter.post("/activate", activateDeliver);
deliverRouter.post("/getonlinedeliveryboys",getOnlineDeliveryBoys)
deliverRouter.post("/online", setOnline);
deliverRouter.post("/offline", setOffline);

export default deliverRouter;



