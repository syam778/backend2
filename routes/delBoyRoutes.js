// routes/delBoyRoutes.js
import express from "express";
import { createDelBoy,  createDelBoys,  delBoyOffline, delBoyOnline, delBoyProfile, deleteDeliveryBoy, getAllDelBoy, getAllDeliveryBoys, getOnlineBoys, getSingleDelBoy, goOffline, goOnline, onlineAll, removeDelBoy, setOffline, setOnline, updateStatus } from "../controllar/delBoyController.js";
import { userProfile } from "../controllar/inputcontrollars.js";

const delBoyRouter = express.Router();

delBoyRouter.post("/create", createDelBoy);
delBoyRouter.get("/get", getAllDelBoy);
delBoyRouter.delete("/delete/:id", removeDelBoy);
delBoyRouter.post("/onlines", delBoyOnline);
delBoyRouter.post("/offlines", delBoyOffline);
delBoyRouter.post("/online", setOnline);
delBoyRouter.post("/offline", setOffline);
delBoyRouter.post("/profile", delBoyProfile);
delBoyRouter.post("/createdelboys", createDelBoys);
delBoyRouter.post("/userprofile", userProfile);
delBoyRouter.post("/get-single",getSingleDelBoy)
delBoyRouter.post("/status", updateStatus);
delBoyRouter.get("/onlines", getOnlineBoys);
delBoyRouter.get("/online-all",onlineAll);

delBoyRouter.get("/all", getAllDeliveryBoys);

// ✅ DELETE DELIVERY BOY
delBoyRouter.delete("/delete/:id", deleteDeliveryBoy);


export default delBoyRouter;
