import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.DB_URL)
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



/*
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();


mongoose.connect(process.env.DB_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error', err));

const dbm= mongoose.connection;

db.on('connection',() =>{
    console.log('connection to mongodb server');
});
db.on('disconnection',() =>{
    console.log('disconnection to mongodb server');
});
db.on('connection',(error) =>{
    console.log('connection to mongodb server error:',error);
})

export default dbm;
*/