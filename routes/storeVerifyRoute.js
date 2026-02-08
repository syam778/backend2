import express from "express";
import { deleteStoreInfo, getAllStoreInfo, quickVerifyStore, verifyStore } from "../controllar/storeVerifyController.js";
//import { verifyStore } from "../controllar/storeVerifyController.js";

const StoreVerifyRouter = express.Router();

StoreVerifyRouter.post("/verify", verifyStore);
StoreVerifyRouter.post("/quick-verify", quickVerifyStore);
StoreVerifyRouter.get("/all", getAllStoreInfo);

// ✅ DELETE STORE INFO
StoreVerifyRouter.delete("/delete/:id", deleteStoreInfo);

export default StoreVerifyRouter;
