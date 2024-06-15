import type { Request, Response } from 'express';
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';
import Post from '../models/Post.model';

const getAllPost = async (req: Request, res: Response) => {
    const user_id = req.user?.user_id
    const verfiyed = req.user?.isVerfiyed
    console.log(user_id, "user id");
    console.log(verfiyed, "user");

    try {
        if (!verfiyed) {
            return sendResponse(res, {
                statusCode: httpStatus.UNAUTHORIZED,
                success: false
            })
        }
        const getPostByUserID = await Post.find({ userId: user_id, sold: false });
        sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: getPostByUserID,
            message: "Get User data successfully",
        });


    } catch (error) {
        sendResponse<any>(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: true,
            data: error,
            message: "Data not found",
        });
    }
}

export default { getAllPost }

