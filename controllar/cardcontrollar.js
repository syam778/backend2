import userModel from "../models/userModel.js"
import express from "express"

//add item to user card

const addToCard = async (req,res) => {
    const frontend_url = "http://localhost:5173/";
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        if (!cardData[req.body.itemId]) 
        {
            cardData[req.body.itemId] = 1;
        }
        else {
            cardData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cardData });
        res.json({ success: true, message: "Added To Card" });
    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }

}

//remove item form user card
const removeFormCard = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        if (cardData[req.body.itemId]>0){
            cardData[req.body.itemId] -=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cardData});
        res.json({success:true,message:"Remove Rorm Card "})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error Entry"})
        
    }

}
//fetch user card data
const getCard = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cardData = await userData.cardData;
        res.json({success:true,cardData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}
export { addToCard, removeFormCard, getCard };


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODAxOGQ0ODgzN2FkNDViM2QwZjkyYyIsImlhdCI6MTczNjY5NjI1NH0.v0jOqkD5YHUitkpmqsRUGYaVKrB3bALqSA6ANUWgHDo
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODNmMzFiZjBmMjE5NmJiNTZjNjIzNyIsImlhdCI6MTczNjcwMDY5OX0.L_ulOMHuxusQEpLR5w_iVqIVtedJ5XGkL_1PNSZY8xg