import express from "express";
import cors from "cors";
import db from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import http from "http";
import {Server} from "socket.io"
import path from "path"
import { fileURLToPath } from "url";
import delBoyModel from "./models/delBoyModel.js";



import dotenv from "dotenv";
dotenv.config();




import userRouter from "./routes/userRoutes.js";

import 'dotenv/config'
import cardRouter from "./routes/cardRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import inputRouter from "./routes/inputRoutes.js";
import deliverRouter from "./routes/deliverRoute.js";
import adminRouter from "./routes/adminRoute.js";
import delBoyRouter from "./routes/delBoyRoutes.js";
import assignRouter from "./routes/assignedOrderRoutes.js";
import StoreVerifyRouter from "./routes/storeVerifyRoute.js";
import StoreRouter from "./routes/storedataRoute.js";





//import { models } from "mongoose";
//app config
const app = express()


const server = http.createServer(app)

const PORT = process.env.port || 3000;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:5174",
    "http://localhost:5175",],
    methods: ["GET", "POST"]
  }
});
//midiware

app.use(express.json())
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
  ],
  credentials: true
}));




io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("delivery-boy-online", async (delBoyId) => {
    await delBoyModel.findByIdAndUpdate(delBoyId, {
      isOnline: true,
      socketId: socket.id
    });

    console.log("Delivery boy ONLINE:", delBoyId);
  });

  socket.on("disconnect", async () => {
    await delBoyModel.findOneAndUpdate(
      { socketId: socket.id },
      { isOnline: false, socketId: null }
    );

    console.log("Delivery boy OFFLINE");
  });
});


app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use(
  "/images",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use("/uploads", express.static("uploads")); // optional



app.use("/api/user",userRouter)
app.use("/api/card",cardRouter)
app.use("/api/order",orderRouter)
app.use("/api/input", inputRouter);
app.use("/api/delivery",deliverRouter)
app.use("/api/admin",adminRouter)
app.use("/api/delboy",delBoyRouter)
app.use("/api/assignorder",assignRouter)
app.use("/api/store",StoreVerifyRouter)
app.use("/api/homestore",StoreRouter)
//app.use("/api/payment",PaymentRouter);



/*server.listen(PORT, () => { //just chenge server
  console.log(`Server is running on http://localhost:${PORT}`);
});*/
server.listen(PORT, () => { //just chenge server
  console.log(`Server is running on http://localhost:${PORT}`);
});

export {server,io}

