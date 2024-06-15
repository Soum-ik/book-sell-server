import express from 'express'
import UserController from '../controller/User.controler'

const router = express.Router()

// get users data
router.post('/sign-up', UserController.SingUp);
router.patch('/sign-in', UserController.SignIn);



export default router