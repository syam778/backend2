/*import express from "express";
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
//import StoreVerifyRouter from "./routes/logicstoreRoute.js";
import StoreRouter from "./routes/storedataRoute.js";
import LogicstoreRouter from "./routes/logicstoreRoute.js";

//import { models } from "mongoose";
//app config
const app = express()


const server = http.createServer(app)

//const PORT = process.env.port || 3000;
const PORT = process.env.PORT || 3000;


/*const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:5174",
    "http://localhost:5175",],
    methods: ["GET", "POST"]
  }
});*
const allowedOrigins = [
  // LOCALHOST
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",

  // LIVE NETLIFY (NO SLASH)
  "https://admin-add.netlify.app",
  "https://deliver-add.netlify.app",
  "https://user-ad.netlify.app",
  "https://store-add.netlify.app",
];

// =======================
// SOCKET.IO CONFIG
// =======================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//midiware

app.use(express.json())
/*app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
  ],
  credentials: true
}));
*

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


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
app.use("/api/store",LogicstoreRouter)
app.use("/api/homestore",StoreRouter)
//app.use("/api/payment",PaymentRouter);

server.listen(PORT, () => { //just chenge server
  console.log(`Server is running on http://localhost:${PORT}`);
});

export {server,io}

*/
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";

import delBoyModel from "./models/delBoyModel.js";

import userRouter from "./routes/userRoutes.js";
import cardRouter from "./routes/cardRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import inputRouter from "./routes/inputRoutes.js";
import deliverRouter from "./routes/deliverRoute.js";
import adminRouter from "./routes/adminRoute.js";
import delBoyRouter from "./routes/delBoyRoutes.js";
import assignRouter from "./routes/assignedOrderRoutes.js";
import StoreRouter from "./routes/storedataRoute.js";
import LogicstoreRouter from "./routes/logicstoreRoute.js";

dotenv.config();



const app = express();
const server = http.createServer(app);

// ✅ FIX PORT
const PORT = process.env.PORT || 3000;

// ✅ Connect DB



/*// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",

  "https://admin-add.netlify.app",
  "https://deliver-add.netlify.app",
  "https://user-ad.netlify.app",
  "https://store-add.netlify.app",

  "https://www.admin-add.netlify.app",
  "https://www.deliver-add.netlify.app",
  "https://www.user-ad.netlify.app",
  "https://www.store-add.netlify.app",
];
*/
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",

  // ✅ Netlify (POP)
  "https://admin-pop.netlify.app",
  "https://delivery-pop.netlify.app",
  "https://store-pop.netlify.app",
  "https://user-pop.netlify.app",

  // ✅ Old Netlify (if still used)
  "https://admin-ad.netlify.app",
  "https://admin-addd.netlify.app",
  "https://store-ad.netlify.app",

  "https://admin-add.netlify.app",
  "https://deliver-add.netlify.app",
  "https://user-ad.netlify.app",
  "https://store-add.netlify.app",
];

// ✅ Express CORS (BEST) 
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/images", express.static(path.join(process.cwd(), "uploads")));

// ✅ Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/card", cardRouter);
app.use("/api/order", orderRouter);
app.use("/api/input", inputRouter);
app.use("/api/delivery", deliverRouter);
app.use("/api/admin", adminRouter);
app.use("/api/delboy", delBoyRouter);
app.use("/api/assignorder", assignRouter);
app.use("/api/store", LogicstoreRouter);
app.use("/api/homestore", StoreRouter);

// ✅ Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("delivery-boy-online", async (delBoyId) => {
    await delBoyModel.findByIdAndUpdate(delBoyId, {
      isOnline: true,
      socketId: socket.id,
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

server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

export { server, io };
