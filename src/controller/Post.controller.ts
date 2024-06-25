import httpStatus from "http-status";
import sendResponse from '../libs/utility/sendResponse';

import { type Request, type Response } from 'express';

// user & post model
import Post from "../models/Post.model";
import Users from "../models/User.model";



// create post
const createPost = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        console.log(userId, "checking user id");

        const { images, semester, totalBook, price, urgent, message, isAvaiableFullSet } = req.body;
        console.log(images.length, "image length");

        if (images.length > 5 && images.length < 3) {
            console.log('error on image');
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE,
                success: false,
                message: "Image's Must be more then 3 and less then 5",
            });
        }

        const post = await Post.create({ userId, images, semester, totalBook, price, urgent, message, isAvaiableFullSet });
        console.log(post, "create post successfully");

        // Handle successful creation
        return sendResponse<any>(res, {
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
        const { semester, minPrice, maxPrice, order } = req.query; // Extract query parameters

        // Customize the semester value
        let custom_semester = '';
        if (semester) {
            switch (parseInt(semester as string)) {
                case 1:
                    custom_semester = '1st';
                    break;
                case 2:
                    custom_semester = '2nd';
                    break;
                case 3:
                    custom_semester = '3rd';
                    break;
                default:
                    custom_semester = semester + 'th';
                    break;
            }
        }

        // Build the query object based on the provided parameters
        const query: any = { isAccept: true };

        // Add price range filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice as string);
            if (maxPrice) query.price.$lte = parseInt(maxPrice as string);
        }

        if (semester) query.semester = custom_semester;

        // Define the sort object based on the provided order parameter
        const sort: any = {};
        if (order) {
            const [sortField, sortOrder] = order.split(':'); // Expecting order to be something like 'price:asc' or 'name:desc'
            sort[sortField] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.date = -1; // Default sorting by date in descending order
        }

        // Fetch posts with the constructed query and sort criteria
        const getPosts = await Post.find(query).sort(sort);

        sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: getPosts,
            message: "Get post successfully",
        });
    } catch (error) {
        console.error("Error fetching posts:", error); // Log the error for debugging
        sendResponse<any>(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            data: error.message, // Send only the error message
            message: "Error fetching posts",
        });
    }
};

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


