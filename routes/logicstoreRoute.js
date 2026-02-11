import express from "express";
import { deleteStoreInfo, getAllStoreInfo, quickVerifyStore, verifyStore } from "../controllar/logicstoreController.js";
//import { deleteStoreInfo, getAllStoreInfo, quickVerifyStore, verifyStore } from "../controllar/logicstoreController.js";


const LogicstoreRouter = express.Router();

LogicstoreRouter.post("/verify", verifyStore);

LogicstoreRouter.post("/quick-verify", quickVerifyStore);
LogicstoreRouter.get("/all", getAllStoreInfo);

// ✅ DELETE STORE INFO
LogicstoreRouter.delete("/delete/:id", deleteStoreInfo);

export default LogicstoreRouter;
