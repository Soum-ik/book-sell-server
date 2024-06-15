import httpStatus from "http-status";
import Book from "../models/Book.model";
import sendResponse from '../libs/utility/sendResponse';
import type { Request, Response } from 'express';
import Posts from "../models/Book.model";



// create post
const createPost = async (req: Request, res: Response) => {
    try {
        const { images, semester, totalBook, price, urgent, message, userId } = req.body;

        if (images.length > 5 && images.length < 3) {
            console.log('error on image');

            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE,
                success: false,
                message: "Image's Must be more then 3 and less then 5",
            });
        }

        const post = await Book.create({ userId, images, semester, totalBook, price, urgent, message });

        // Handle successful creation
        sendResponse<any>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            data: post,
            message: "Post created successfully",
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
    const result = await Posts.find()
}


export default { createPost }


