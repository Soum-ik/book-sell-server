import type { Request, Response } from 'express';
import httpStatus from "http-status";
import sendResponse from "../libs/utility/sendResponse";
import Chat from "../models/Chat.model";


const getChats = async (req: Request, res: Response) => {
    try {
        const chats = await Chat.find().sort({ timestamp: -1 });
        return sendResponse<any>(res, {
            statusCode: httpStatus.OK, success: false, message: "User name is already used", data: chats
        })
    } catch (error) {
        return sendResponse<any>(res, {
            statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "User name is already used"
        })
    }
};

const sendChat = async (req: Request, res: Response) => {
    const { message, sender } = req.body;
    const chat = new Chat({
        message,
        sender
    });
    try {
        const newChat = await chat.save();
        return sendResponse<any>(res, {
            statusCode: httpStatus.OK, success: false, message: "User name is already used", data: newChat
        })
    } catch (error) {
        return sendResponse<any>(res, {
            statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "User name is already used"
        })
    }
};


export default { getChats, sendChat };
