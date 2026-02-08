
import express from "express";
import { addFood,getFoodByStoreId,listFood,removeFood,   } from "../controllar/foodcontrollar.js";
import multer from "multer";
//import { verifyStoreData } from "../controllar/storedataController.js";

const foodRouter = express.Router();

//image storeg ingene
/*const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`) //old img system
    }
})*/
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});



const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);
foodRouter.get("/store/:storeId", getFoodByStoreId);


export default foodRouter;
