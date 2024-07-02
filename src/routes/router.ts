import express from 'express'
import UserController from '../controller/User.controller'
import PostController from '../controller/Post.controller'
import UserPostController from '../controller/UserPosts.controller'
import authenticateToken from '../middleware/auth';
import PostLikeController from '../controller/PostLike.controller';
import PostCommectController from '../controller/PostCommect.controller';

const router = express.Router()

// get users api route -done
router.post('/sign-up', UserController.SingUp);
router.post('/sign-in', UserController.SignIn);
router.get('/user/:id', UserController.getUsers);

// get users profile
router.get('/verified-user', authenticateToken, UserController.getVerifiedUser)

// verifiy user -done
router.get('/verifi-user/:otp', UserController.verifiyUser)

// forget password  -done
router.get('/forgot-pass/:email', UserController.forgotPass)
router.get('/verifi-pass/:otp', UserController.verfiyPass)
router.put('/new-pass/:email/:password', UserController.setNewPass)


// profile update
router.get('/profile-update/:updateName', authenticateToken, UserController.profileUpdate)

// create Posts api route
router.post('/create-post', authenticateToken, PostController.createPost);
router.get('/get-post', PostController.getPost);
router.patch('/get-singel-post/:id', PostController.getSingelPost);

// get user post api 
router.post("/get-user-all-post", UserPostController.getAllPost)

// post like & dislike & message options
router.put('/post-like', authenticateToken, PostLikeController.postLike)
router.post('/post-comment', authenticateToken, PostCommectController.postComment)
router.get('/get-comment',   PostCommectController.getComment)

export default router