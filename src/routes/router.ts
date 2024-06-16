import express from 'express'
import UserController from '../controller/User.controller'
import PostController from '../controller/Post.controller'
import UserPostController from '../controller/UserPosts.controller'
import authenticateToken from '../middleware/auth';
import authenticateAdminToken from '../middleware/admin';

const router = express.Router()

// get users api route
router.post('/sign-up', UserController.SingUp);
router.patch('/sign-in', UserController.SignIn);

// create Posts api route
router.post('/create-post', authenticateToken, PostController.createPost);
router.get('/get-post',authenticateToken, PostController.getPost);
router.patch('/get-singel-post/:id', authenticateToken, PostController.getSingelPost);

// get user post api 
router.post("/get-user-all-post", authenticateAdminToken, UserPostController.getAllPost)

export default router