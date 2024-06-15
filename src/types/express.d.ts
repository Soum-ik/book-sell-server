import { Request } from 'express';

interface UserPayload {
    user_id: string;
    role: string;
    isVerfiyed: boolean;
    suspend: boolean;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload;
    }
}
