import express from 'express'
import UserController from '../controller/User.controller'
import PostController from '../controller/Post.controller'
import authenticateToken from '../middleware/auth';

const router = express.Router()

// get users api route
router.post('/sign-up', UserController.SingUp);
router.patch('/sign-in', UserController.SignIn);

// create Posts api route
router.post('/create-post', authenticateToken, PostController.createPost);
router.get('/get-post',authenticateToken, PostController.getPost);
router.patch('/get-singel-post/:id', authenticateToken, PostController.getSingelPost);


export default router