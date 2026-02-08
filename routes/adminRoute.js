import express from "express";
//import { adminAuth, createAdmin, getAdmin, loginAdmin } from "../controllar/adminController.js";
import { createAdmin, getAdmin, removeAdmin } from "../controllar/adminController.js";


const adminRouter = express.Router();

adminRouter.post("/create", createAdmin);
adminRouter.get("/get", getAdmin);
adminRouter.delete("/remove/:id", removeAdmin);


export default adminRouter;
/*
const adminRouter = express.Router();
adminRouter.post("/admin/create", createAdmin);
adminRouter.get("/admin/get", getAdmin);
adminRouter.post("/admin/login", loginAdmin);
adminRouter.get("/admin/protected", adminAuth, (req, res) => {
  res.json({ success: true, message: "Admin Access Granted" });
});

export default adminRouter;*/