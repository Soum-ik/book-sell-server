import express from 'express'
import UserController from '../controller/user.controler'

const router = express.Router()

// get users data
router.get('/', UserController.getUser) 

export default router