
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import express from "express"
//import Razorpay from "razorpay"
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/*const razorpay = new Razorpay({
    key_id:"rzp_test_qR05WbFxZAAsek" , // Your Razorpay key_id
    key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay key_secret
  });
  */

//placing user oder for frontend
const placeOrder = async (req,res) =>{
    const frontend_url = "http://localhost:5174/";
    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,
            city:req.body.city,
            phone:req.body.phone,
            firstName:req.body.firstName,
            street:req.body.street
            
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cardData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data :{
                currency:"inr",
                product_data:{
                    name:item.name,
                    

                },
                unit_amount:item.price*100*1
                
            },
            quantity:item.quantity
        }))
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:5*100*1
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}myorders`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}
const verifyOrder = async (req,res) =>{
    const {orderId,success} = req.body;
    try {
        if (success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Payment Successful"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Pay"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }

}

//user order for frontend
const userOrder = async (req,res) =>{
    try {
        const orders= await orderModel.find({userId:req.body.userId})
        res.json({success:true,message:"Done",data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Coming"})
        
    }

}
//listing order for admin panel
const listOrders = async(req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Error"})
        
    }

}
//api for updating order status
const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Update"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Status Not Update"})
    }

}
export {placeOrder,verifyOrder,userOrder,listOrders,updateStatus}

//process.env.RAZORPAY_KEY_ID
//success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,