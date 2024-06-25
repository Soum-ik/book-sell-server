import httpStatus, { NOT_FOUND } from "http-status"
import { verifyToken, type TokenCredential } from "../libs/hepler/auth/jwtHelper"
import type { Request, Response, NextFunction } from "express"
import sendResponse from "../libs/utility/sendResponse"
import { decode, type JwtPayload } from "jsonwebtoken"

const authenticateAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === 'string') {
        const token = authHeader.split(' ')[1] || authHeader

        if (!token) {
            return sendResponse(res, {
                statusCode: NOT_FOUND,
                success: false,
                message: 'Token not found'
            });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return sendResponse(res, {
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: 'Token is invalid',
            });
        }
        const { role } = decode
        if (role !== "ADMIN") {
            return sendResponse(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE,
                success: false,
                message: 'Sorry your not admin',
            });
        }

        req.user = decoded as JwtPayload
        next()
    } else {
        sendResponse(res, {
            statusCode: httpStatus.FORBIDDEN,
            success: false,
            message: 'Something want wrong',
        });
    }

}
export default authenticateAdminToken