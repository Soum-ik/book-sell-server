import express from 'express'
import UserController from '../controller/User.controler'
import BookController from '../controller/Book.controler'
import authenticateToken from '../middleware/auth';

const router = express.Router()

// get users api route
router.post('/sign-up', UserController.SingUp);
router.patch('/sign-in', UserController.SignIn);

// create books api route
router.post('/create-post', authenticateToken, BookController.createPost);
router.get('/get-post',authenticateToken, BookController.getPost);
router.patch('/get-singel-post/:id', authenticateToken, BookController.getSingelPost);


export default router