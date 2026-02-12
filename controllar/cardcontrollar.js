import userModel from "../models/userModel.js"
import express from "express"

//add item to user card

const addToCard = async (req,res) => {
    //const frontend_url = "http://localhost:5173/";
    const frontend_url = "https://admin-add.netlify.app/"
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

 const getCard = async (req, res) => {
  try {
    const card = await userModel.findOne({ userId: req.user.id }); // or whatever query you use

    // ❌ Previous code would fail here if card is null:
    // const data = card.cardData;

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    // ✅ Safe to access now
    const cardData = card.cardData;

    res.status(200).json({
      success: true,
      cardData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getCartData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (err) {
    console.error("GET CART ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { addToCard, removeFormCard, getCard };


