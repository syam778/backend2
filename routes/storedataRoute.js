import express from "express";
import { checkStoreUser, createStore, getAllStores, getSingleStore, getStore, removeStore,verifyUser } from "../controllar/storedataControllers.js";



const StoreRouter = express.Router();

StoreRouter.post("/create", createStore);
StoreRouter.get("/all", getAllStores);
StoreRouter.get("/:id", getSingleStore);
StoreRouter.delete("/remove/:id", removeStore);
StoreRouter.post("/check", checkStoreUser);
//StoreRouter.post("/login", storeLogin);
StoreRouter.get("/", getStore);
StoreRouter.post("/verify", verifyUser);

export default StoreRouter;

 