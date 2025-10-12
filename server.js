
import express from "express";
import cors from "cors";
//import { connectDB } from "./config/db.js";
//import dbm from "./config/db.js";
import db from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
//import { registerUser,loginUser } from "./controllers/userController.js";

import dotenv from "dotenv";
dotenv.config();




import userRouter from "./routes/userRoutes.js";
import 'dotenv/config'
import cardRouter from "./routes/cardRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
//import { models } from "mongoose";



//app config
const app = express()
const PORT = process.env.port || 3000;

//midiware
app.use(express.json())
app.use(cors()) 
//db connection
//connectDB();

//api end point
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/card",cardRouter)
app.use("/api/order",orderRouter)

app.get("/name/:slug",(req,res)=>{
  res.send(`fetch the blogpost for ${req.params.slug}`)
})


app.get("/",(req,res)=>{
  res.send("API WORKING")
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//mongodb+srv://syama:Syama123@cluster0.cewg7.mongodb.net/?
//RAZORPAY_SECRET_KEY ="YhtPzHo7KrgiCmxRy1vk5u6C"
//RAZORPAY_KYE_ID = "rzp_test_qR05WbFxZAAsek"
//RAZORPAY_SECRET_KEY ="YhtPzHo7KrgiCmxRy1vk5u6C"
//RAZORPAY_KYE_ID = "rzp_test_qR05WbFxZAAsek"
//"server": "nodemon server.js",