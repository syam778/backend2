import express from "express";
import cors from "cors";
//import { connectDB } from "./config/db.js";
//import dbm from "./config/db.js";
import db from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
//import { registerUser,loginUser } from "./controllers/userController.js";

import http from "http";
import {Server} from "socket.io"
import path from "path"
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();




import userRouter from "./routes/userRoutes.js";
import 'dotenv/config'
import cardRouter from "./routes/cardRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
//import { models } from "mongoose";



//app config
const app = express()

app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST"]
}));
//const server = http.createServer(app)
//const io = new Server(server)
const server = http.createServer(app)
//const io = new Server(server)
//const PORT = 3001;

/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","jsx");
//app.use(express.static(path.join(__dirname,"public")));
app.use(express.static("frontend/dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/Mapss.jsx"));
});
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/assets/*.js"));
});


const PORT = process.env.port || 3000;

//midiware

app.use(express.json())
app.use(cors()) 
const io = new Server(server, {
  /*cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }*/
 cors: {
    origin: "*",
  },
});
app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST"]
}));
//db connection
//connectDB();


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // receive location from client
    socket.on("send-location",(data) => {
        // broadcast to all clients
        io.emit("receive-location", {id:socket.id, ...data});
    });

    socket.on("disconnect", () => {
        io.emit("User disconnected",socket.id)
        console.log("User disconnected:", socket.id);
    });
});

//api end point
/*io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-location", (data) => {
    // broadcast the location to everyone except sender
    io.emit("receive-location", data);
  });

  socket.on("disconnect", () => {
    io.emit("User disconnected", socket.id);
  });
});
*/
/*io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // receive location from client
    socket.on("send-location",(data) => {
        // broadcast to all clients
        io.emit("receive-location", {id:socket.id, ...data});
    });

    socket.on("disconnect", () => {
        io.emit("User disconnected",socket.id)
        console.log("User disconnected:", socket.id);
    });
});*/


app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/card",cardRouter)
app.use("/api/order",orderRouter)


app.get("/name/:slug",(req,res)=>{
  res.send(`fetch the blogpost for ${req.params.slug}`)
})


app.get("/i",(req,res)=>{
  res.send("API WORKING ")
})
app.get("/socket",(req,res)=>{
  res.send("API WORKING  socket")
})
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





/*

import express from "express";
import cors from "cors";
//import { connectDB } from "./config/db.js";
//import dbm from "./config/db.js";
import db from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
//import { registerUser,loginUser } from "./controllers/userController.js";

import http from "http";
import {Server} from "socket.io"
import path from "path"
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();




import userRouter from "./routes/userRoutes.js";
import 'dotenv/config'
import cardRouter from "./routes/cardRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
//import { models } from "mongoose";



//app config
const app = express()

app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST"]
}));
//const server = http.createServer(app)
//const io = new Server(server)
const server = http.createServer(app)
//const io = new Server(server)
//const PORT = 3001;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app.set("view engine","ejs");
//app.use(express.static(path.join(__dirname,"public")));
app.use(express.static("frontend/dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

const PORT = process.env.port || 3000;

//midiware

app.use(express.json())
app.use(cors()) 
//db connection
//connectDB();

//api end point

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // receive location from client
    socket.on("send-location",(data) => {
        // broadcast to all clients
        io.emit("receive-location", {id:socket.id, ...data});
    });

    socket.on("disconnect", () => {
        io.emit("User disconnected",socket.id)
        console.log("User disconnected:", socket.id);
    });
});


app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/card",cardRouter)
app.use("/api/order",orderRouter)


app.get("/name/:slug",(req,res)=>{
  res.send(`fetch the blogpost for ${req.params.slug}`)
})


app.get("/",(req,res)=>{
  res.send("API WORKING ")
})
app.get("/socket",(req,res)=>{
  res.send("API WORKING  socket")
})
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

*/

//mongodb+srv://syama:Syama123@cluster0.cewg7.mongodb.net/?
//RAZORPAY_SECRET_KEY ="YhtPzHo7KrgiCmxRy1vk5u6C"
//RAZORPAY_KYE_ID = "rzp_test_qR05WbFxZAAsek"
//RAZORPAY_SECRET_KEY ="YhtPzHo7KrgiCmxRy1vk5u6C"
//RAZORPAY_KYE_ID = "rzp_test_qR05WbFxZAAsek"
//"server": "nodemon server.js",
/*io.on("connection",function(socket){
  socket.on("send-location",function(data){
    io.emit("receive-location",{id:socket.id, ...data});
  });
  console.log("connected")
})

io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.on("send-location", (data) => {
        // attach socket ID if not included
        data.id = socket.id;

        io.emit("receive-location", data);
    });
});

*/
/*
import express from "express";

import http from "http";
import {Server} from "socket.io"
import path from "path"
import { fileURLToPath } from "url";


//app config
const app = express()




const server = http.createServer(app)
const io = new Server(server)
//const PORT = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
//midiware

//app.use(express.json())

//connectDB();

//api end point



 
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // receive location from client
    socket.on("send-location",(data) => {
        // broadcast to all clients
        io.emit("receive-location", {id:socket.id, ...data});
    });

    socket.on("disconnect", () => {
        io.emit("User disconnected",socket.id)
        console.log("User disconnected:", socket.id);
    });
});

/*io.on("connection",function(socket){
  socket.on("send-location",function(data){
    io.emit("receive-location",{id:socket.id, ...data});
  });
  console.log("connected")
})

io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.on("send-location", (data) => {
        // attach socket ID if not included
        data.id = socket.id;

        io.emit("receive-location", data);
    });
});





app.get("/",(req,res)=>{
  res.render("index")
})
app.get("/socket",(req,res)=>{
  res.send("API WO")
})
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//mongodb+srv://syama:Syama123@cluster0.cewg7.mongodb.net/?
//RAZORPAY_SECRET_KEY ="YhtPzHo7KrgiCmxRy1vk5u6C"
//RAZORPAY_KYE_ID = "rzp_test_qR05WbFxZAAsek"
//RAZORPAY_SECRET_KEY ="YhtPzHo7KrgiCmxRy1vk5u6C"
//RAZORPAY_KYE_ID = "rzp_test_qR05WbFxZAAsek"
//"server": "nodemon server.js",


//<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js" integrity="sha512-BwHfrr4c9kmRkLw6iXFdzcdWV/PGkVgiIyIWLLlTSXzWQzxuSg4DiQUCpauz/EWjgk5TYQqX/kvn9pG1NpYfqg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
*/