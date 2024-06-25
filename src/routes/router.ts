import express from 'express'
import UserController from '../controller/User.controller'
import PostController from '../controller/Post.controller'
import UserPostController from '../controller/UserPosts.controller'
import authenticateToken from '../middleware/auth';
import authenticateAdminToken from '../middleware/admin';

const router = express.Router()

// get users api route
router.post('/sign-up', UserController.SingUp);
router.post('/sign-in', UserController.SignIn);
router.get('/user/:id', UserController.getUser);

// verifiy user
router.get('/forgot-pass/:email', UserController.forgotPass)
router.get('/verifi-user/:otp', UserController.verifiyUser)
router.put('/new-pass/:email/:password', UserController.setNewPass)

// create Posts api route
router.post('/create-post', PostController.createPost);
router.get('/get-post', PostController.getPost);
router.patch('/get-singel-post/:id', PostController.getSingelPost);

// get user post api 
router.post("/get-user-all-post", UserPostController.getAllPost)

export default router