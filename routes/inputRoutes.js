import express from "express";
import { createDelProfileUser, createUser, userProfile, userProfilenano, verifyUser } from "../controllar/inputcontrollars.js";


const inputRouter = express.Router();

inputRouter.post("/create", createUser);
inputRouter.post("/verify", verifyUser);
inputRouter.post("/userprofile", userProfile);
inputRouter.post("/userprofilenano", userProfilenano);
inputRouter.post("/createdelprofileuser", createDelProfileUser);

export default inputRouter;



/*import express from "express";
import { createDelProfileUser, createUser, userProfile, userProfilenano, verifyUser } from "../controllar/controllars.js";


    
const inputRouter = express.Router();

inputRouter.post("/create",createUser);
//inputRouter.get("/:email", getUserByEmail);
inputRouter.post("/verify", verifyUser);
inputRouter.post("/userprofile", userProfile);
inputRouter.post("/userprofilenano", userProfilenano);
inputRouter.post("/createdelprofileuser",createDelProfileUser)  //old code 
export default inputRouter;
*/