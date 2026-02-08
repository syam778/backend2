import express from "express";
import { checkStoreUser, createStore, getAllStores, getSingleStore, removeStore } from "../controllar/storedataControllers.js";



const StoreRouter = express.Router();

StoreRouter.post("/create", createStore);
StoreRouter.get("/all", getAllStores);
StoreRouter.get("/:id", getSingleStore);
StoreRouter.delete("/remove/:id", removeStore);
StoreRouter.post("/check", checkStoreUser);

export default StoreRouter;

 