import express from 'express'
import UserController from '../controller/User.controler'

const router = express.Router()

// get users data
router.get('/', UserController.getUser);
router.post('/sign-up', UserController.SingUp);
router.get('/sign-in', UserController.SignIn);



export default router