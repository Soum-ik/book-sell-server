import httpStatus, { NOT_FOUND } from "http-status"
import { verifyToken } from "../libs/hepler/auth/jwtHelper"
import type { Request, Response, NextFunction } from "express"
import sendResponse from "../libs/utility/sendResponse"

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader

    if (!token) {
        return sendResponse<any>(res, {
            statusCode: NOT_FOUND,
            success: false,
        })
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return sendResponse(res, {
            statusCode: httpStatus.FORBIDDEN,
            success: false,
            message: 'Token is invalid',
        });
    }



    req.user = decoded;
    next()

}
export default authenticateToken