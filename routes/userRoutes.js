import express from "express";
import { deleteUser, getAllUsers, loginUser,registerUser, } from "../controllar/usercontrollar.js";



const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/dregister",registerUser)
userRouter.post("/dlogin",loginUser)
userRouter.get("/all", getAllUsers);
userRouter.delete("/delete/:id", deleteUser);





export default userRouter;