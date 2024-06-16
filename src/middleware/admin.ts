import httpStatus, { NOT_FOUND } from "http-status"
import { verifyToken, type TokenCredential } from "../libs/hepler/auth/jwtHelper"
import type { Request, Response, NextFunction } from "express"
import sendResponse from "../libs/utility/sendResponse"
import { decode, type JwtPayload } from "jsonwebtoken"

const authenticateAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader

    if (!token) {
        return sendResponse<any>(res, {
            statusCode: NOT_FOUND,
            success: false,
            message: "Token not found"
        })
    }

    let decoded: TokenCredential | null = null;


    try {
        const result = verifyToken(token);
        if (result && typeof result !== 'string') {
            decoded = result as TokenCredential;
        } else {
            throw new Error('Invalid token format');
        }
    } catch (error) {
        return sendResponse(res, {
            statusCode: httpStatus.FORBIDDEN,
            success: false,
            message: 'Token is invalid',
        });
    }
    
    console.log(decoded, "decoded");
    
    const role = decoded.role

    if (role !== "ADMIN") {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_ACCEPTABLE,
            success: false,
            message: 'Sorry your not admin',
        });
    }

    req.user = decoded as JwtPayload
    next()

}
export default authenticateAdminToken