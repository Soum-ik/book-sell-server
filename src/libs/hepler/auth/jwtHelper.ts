// auth.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION_TIME } from '../../../config/config';

interface TokenCredential {
    user_id: string;
}

export const createToken = ({ user_id }: TokenCredential) => {
    const payload = { user_id };
    const options = { expiresIn: JWT_EXPIRATION_TIME };
    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
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
