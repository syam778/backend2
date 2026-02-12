import searchModel from "../models/searchModel.js";
import express from "express"

const searchAdd = async (req,res) => {
    const frontend_url = "https://admin-add.netlify.app/"; //admin url

    let image_filename = `${req.file.filename}`;

    const food = new searchModel({
        name:req.body.name,
        image:image_filename,
    })
    try{
        await food.save();
        res.json({success:true,massage:"Image show"})

        
    } catch(error){
        console.log(error)
        res.json({success:false,massage:" image Error"})

    }

}
export {searchAdd};