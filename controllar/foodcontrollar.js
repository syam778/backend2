//import foodModel from '../models/foodmodel.js';
import foodModel from '../models/foodModel.js';
import fs from 'fs'
import express from "express"
//add food items
 const addFood = async (req,res) =>{
    
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category,
        image:image_filename,
        firstName:req.body.firstName,
        phone:req.body.phone,
        street:req.body.street,
        city:req.body.city,
        maps:req.body.maps
    })
    try{
        await food.save();
        res.json({success:true,massage:"Food added"})

        
    } catch(error){
        console.log(error)
        res.json({success:false,massage:"Error"})

    }
        

}

//all food list
const listFood = async(req,res)=>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    }catch (error){
        console.log(error);
        res.json({success:false,massage:"error"})

    }

}

//remove food items
const removeFood = async (req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);  //find the id this code
        fs.unlink(`uploads/${food.image}`,()=>{})  //delet img this code
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,massage:"food REmoved"})
    } catch (error) {
        console.log(error);
        res.json({success:false,massage:"Error"})
        
    }

}
export {addFood,listFood,removeFood};

