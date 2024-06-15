import httpStatus from "http-status";
import Post from "../models/Post.model";
import sendResponse from '../libs/utility/sendResponse';
import { type Request, type Response } from 'express';

import Users from "../models/User.model";



// create post
const createPost = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        console.log(userId, "checking user id");

        const { images, semester, totalBook, price, urgent, message, isAvaiableFullSet } = req.body;

        if (images.length > 5 && images.length < 3) {
            console.log('error on image');

            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE,
                success: false,
                message: "Image's Must be more then 3 and less then 5",
            });
        }

        const post = await Post.create({ userId, images, semester, totalBook, price, urgent, message, isAvaiableFullSet });

        // Handle successful creation
        sendResponse<any>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            data: post,
            message: "Post created successfully, This is in review section.",
        });

    } catch (error) {
        sendResponse<any>(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            data: error,
            message: "Something went wrong",
        });
    }
};

// get all post 
const getPost = async (req: Request, res: Response) => {
    try {
        const getPosts = await Post.find({ isAccept: true });
        sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: getPosts,
            message: "Get post successfully",
        });
    } catch (error) {
        sendResponse<any>(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: true,
            data: error,
            message: "Get post successfully",
        });

    }
}

// get by Id
const getSingelPost = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const post = await Post.findById(id);

        // If post is found, fetch the user based on post's userId
        if (!post) {
            // If post is null, return a 404 Not Found response
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "Post not found",
            });
        }

        const userId = post.userId;

        const user = await Users.findById(userId, { isVerfiyed: true })
        const Datas = { post, user }



        sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: Datas,
            message: "Get Data successfully",
        });
    } catch (error) {
        sendResponse<any>(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            data: error,
            message: "Some went worng",
        });
    }
}


export default { createPost, getPost, getSingelPost }

