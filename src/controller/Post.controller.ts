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
        const { image } = await Users.findById(userId)

        let create_post = await Post.create({ userId, images, semester, totalBook, price, urgent, message, isAvaiableFullSet, UserImage: image });


        // Handle successful creation
        return sendResponse<any>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            data: create_post,
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
        const { semester, minPrice, maxPrice, order, urgent, isAvaiableFullSet, page = 1, search } = req.query; // Extract query parameters


        // Ensure searchString is properly initialized
        const searchString = search
            ? search
                .split(" ")
                .filter((word: string) => word.length > 0)
                .join(" & ")
            : "";

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
        const query: any = { isAccept: true };
        if (semester) query.semester = custom_semester;
        if (urgent) query.urgent = urgent;
        if (isAvaiableFullSet) query.isAvaiableFullSet = isAvaiableFullSet;


        // Add price range filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice as string);
            if (maxPrice) query.price.$lte = parseInt(maxPrice as string);
        }
        const sort: any = {};
        if (order) {
            sort.createdAt = -1;
        } else {
            sort.createdAt = -1;
        }
        // Define pagination
        const limit = 10;
        // const skip = (parseInt(page as string) - 1) * limit;

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


