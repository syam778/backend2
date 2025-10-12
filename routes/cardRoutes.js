import express from 'express'
import { addToCard,removeFormCard,getCard } from '../controllar/cardcontrollar.js'
import authMiddleware from '../middleware/auth.js';
const cardRouter =express.Router();

cardRouter.post("/add",authMiddleware,addToCard)
cardRouter.post("/remove",authMiddleware,removeFormCard)
cardRouter.post("/get",authMiddleware,getCard)
export default cardRouter;