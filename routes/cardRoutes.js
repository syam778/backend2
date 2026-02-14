import express from 'express'
import { addToCard,removeFormCard,getCard, getCartData } from '../controllar/cardcontrollar.js'
import authMiddleware from '../middleware/auth.js';
const cardRouter =express.Router();

cardRouter.post("/add",authMiddleware,addToCard)
cardRouter.post("/like",authMiddleware,addToCard)
cardRouter.post("/remove",authMiddleware,removeFormCard)
cardRouter.post("/get",authMiddleware,getCard)
cardRouter.post("/get", getCartData);
export default cardRouter;