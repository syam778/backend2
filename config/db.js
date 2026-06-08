/*import mongoose from "mongoose";  //old code

import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 sec timeout this block off code add 
  })
    
//mongoose.connect(process.env.DB_URI);

.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error', err));

const db= mongoose.connection;

db.on('connection',() =>{
    console.log('connection to mongodb server');
});
db.on('disconnection',() =>{
    console.log('disconnection to mongodb server');
});
db.on('connection',(error) =>{
    console.log('connection to mongodb server error:',error);
})

export default db;

// new code db
*/
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 5000, // ✅ 5 sec timeout
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection error:", err));

const db = mongoose.connection;

// ✅ Correct Events
db.on("connected", () => {
  console.log("🟢 MongoDB connected");
});

db.on("disconnected", () => {
  console.log("🔴 MongoDB disconnected");
});

db.on("error", (error) => {
  console.log("❌ MongoDB error:", error);
});

export default db;
