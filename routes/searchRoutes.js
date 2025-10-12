import express from 'express'
import { searchAdd } from '../controllar/searchcontrollar.js'
import authMiddleware from '../middleware/auth.js'

const searchRouter = express.Router()

searchRouter.get("/name/:slug",authMiddleware,searchAdd)
searchRouter.get("/name/:slug",searchAdd)


export default searchRouter;