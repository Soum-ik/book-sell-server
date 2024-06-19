import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION_TIME } from '../../../config/config';

export interface TokenCredential {
    user_id: String
    role: String
    isVerfiyed: Boolean
    suspend: Boolean
}

export const createToken = ({ user_id, isVerfiyed, role, suspend }: TokenCredential) => {
    const payload = { user_id, isVerfiyed, role, suspend };
    const options = { expiresIn: JWT_EXPIRATION_TIME };
    try {
        const token = jwt.sign(payload, JWT_SECRET, options);
        return token;
    } catch (error) {
        console.error('Token not created:', error);
    }
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};
