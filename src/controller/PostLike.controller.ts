import type { Request, Response } from 'express';
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';
import { Like } from '../models/like.model';
import Post from '../models/Post.model';

const postLike = async (req: Request, res: Response) => {
    const userId = req.user?.user_id;
    const { postId } = req.query;

    try {
        // Check if a Like document exists for this post
        let like = await Like.findOne({ postId });

        if (!like) {
            // If no Like document exists, create one
            like = new Like({
                userId: userId,
                postId,
                usersLiked: [userId]
            });
        } else {
            // Check if the user has already liked the post
            const hasLiked = like.usersLiked.includes(userId);
            if (hasLiked) {
                // If the user has already liked the post, remove the like
                like.usersLiked = like.usersLiked.filter(id => id !== userId);
            } else {
                // If the user hasn't liked the post, add the like
                like.usersLiked.push(userId);
            }
        }

        await like.save();

        return sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: like.usersLiked.includes(userId) ? "Like added" : "Like removed",
            data: like,
        });

    } catch (error) {
        return sendResponse<any>(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "An error occurred",
            data: error,
        });
    }
}
const getLike = async (req: Request, res: Response) => {
    try {
        const { postId } = req.query;
        let totalLike = await Like.find({ postId })
        const totalLikes = totalLike.length

        return sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Total likes',
            data: { totalLike, totalLikes },
        });

    } catch (error) {
        return sendResponse<any>(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "An error occurred",
            data: error,
        });
    }
}


export default { postLike, getLike };
