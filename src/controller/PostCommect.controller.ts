import type { Request, Response } from 'express';
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';
import Post from '../models/Post.model';
import { Comment } from '../models/Comment.model';

const postComment = async (req: Request, res: Response) => {
    const userId = req.user?.user_id;
    const { postId, commentText, userImage } = req.body;
    console.log(req.body);

    try {
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "Post not found",
            });
        }

        // Create a new comment
        const newComment = new Comment({
            userId,
            postId,
            comments: commentText,
            userImage
        });

        await newComment.save();

        return sendResponse<any>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Comment added successfully",
            data: newComment
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

export default { postComment };
