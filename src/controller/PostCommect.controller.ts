import type { Request, Response } from 'express';
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';
import Post from '../models/Post.model';
import { Comment } from '../models/Comment.model';
import Users, { type User } from '../models/User.model';

const postComment = async (req: Request, res: Response) => {
    const userId = req.user?.user_id;
    const { postId, commentText, userImage } = req.body;

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
        const user: any = await Users.findById(userId).select({ username: true });
        const { username } = user


        // Create a new comment
        const newComment = new Comment({
            userId,
            postId,
            comments: commentText,
            userImage,
            username
        });

        await newComment.save();
        console.log(newComment, 'new component register');

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

const getComment = async (req: Request, res: Response) => {

    const { postId, limit } = req.query;

    try {
        const userName = await Users.findById(postId)
        // Check if the post exists
        const comments = await Comment.find({ postId: postId }).limit(parseInt(limit as string));


        if (!comments) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "comments not found",
            });
        }
        return sendResponse<any>(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: { comments, userName },
            message: "comments get successfull",
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


export default { postComment, getComment };
