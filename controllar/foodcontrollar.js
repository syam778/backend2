import mongoose from "mongoose";
import foodModel from "../models/foodModel.js"; //this code all right 1st
import fs from "fs";
import StoreData from "../models/storedataModel.js"; // assuming you have a store model

export const addFood = async (req, res) => {
  try {
    // File validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required"
      });
    }

    const {
      createdBy,
      storeIdRef,
      name,
      price,
      description,
      category,
      firstName,
      phone,
      street,
      city,
      linkdata,
      itemSize,
    } = req.body;
    //add code
    let parsedItemSize = itemSize;
    if (typeof itemSize === "string") {
      parsedItemSize = JSON.parse(itemSize);
    }

    // 🔒 Validate role logic
    if (!createdBy || !["store", "admin"].includes(createdBy)) {
      return res.status(400).json({
        success: false,
        message: "createdBy must be 'store' or 'admin'"
      });
    }

    if (createdBy === "store" && !storeIdRef) {
      return res.status(400).json({
        success: false,
        message: "Store must provide storeIdRef"
      });
    }

    if (createdBy === "admin" && storeIdRef) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot provide storeIdRef"
      });
    }

    // ✅ Create food
    const food = await foodModel.create({
      name,
      itemSize,
      price,
      description,
      category,
      image: req.file.filename,
      firstName,
      phone,
      street,
      city,
      linkdata,
      createdBy,
      storeIdRef: createdBy === "store" ? storeIdRef : null
    });

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      data: food
    });

  } catch (error) {
    console.error("FOOD CREATE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const listFood = async (req, res) => {
  try {
    const { userRole, storeId } = req.query; // frontend must send role + storeId

    let query = {};
    if (userRole === "store") {
      // store sees only its own items
      query.storeIdRef = storeId;
    }
    // admin sees all (query = {})

    const foods = await foodModel.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching food list" });
  }
};


export const removeFood = async (req, res) => {
  try {
    const { id, userRole, storeId } = req.body;

    const food = await foodModel.findById(id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    // store can remove only its own items
    if (userRole === "store" && food.storeIdRef.toString() !== storeId) {
      return res.status(403).json({ success: false, message: "Cannot remove another store's item" });
    }

    // delete image
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.log("Image delete error:", err);
    });

    await foodModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};



export const getFoodByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params; // 👈 storeId from URL

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "storeId is required"
      });
    }

    const foods = await foodModel.find({
      storeIdRef: new mongoose.Types.ObjectId(storeId)
    });

    if (foods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No food found for this store"
      });
    }

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });

  } catch (error) {
    console.error("STORE FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
