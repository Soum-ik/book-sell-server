import type { Request, Response } from 'express';
import Users from "../models/User.model";
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';

const getUser = async (req: Request, res: Response) => {
    const result = await Users.find();

    sendResponse<any>(res, {
        statusCode: httpStatus.OK, success: true, data: result, message: "Find Data Successfully",
    })
}


export default { getUser }