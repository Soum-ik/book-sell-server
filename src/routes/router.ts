import express from 'express'
import UserController from '../controller/User.controler'
import BookController from '../controller/Book.controler'

const router = express.Router()

// get users api route
router.post('/sign-up', UserController.SingUp);
router.patch('/sign-in', UserController.SignIn);

// create books api route
router.post('/create-post', BookController.createPost);
router.get('/get-post', BookController.getPost);
router.patch('/get-singel-post/:id', BookController.getSingelPost);


export default router