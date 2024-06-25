import type { Request, Response } from 'express';
import Users from "../models/User.model";
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';
import sendEmail from '../libs/hepler/Email/emaliSend';
import bcrypt from "bcrypt"
import { createToken } from '../libs/hepler/auth/jwtHelper';
import { relativeDate } from '../libs/hepler/validation/validation';
import { compareAsc, endOfISOWeekYear } from 'date-fns';


const SingUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password, number, image, semester } = await req.body;
        const userNameExist = await Users.findOne({
            username
        })
        const emailExist = await Users.findOne({
            email
        })

        // code genarate
        const verfiyCode = Math.floor(1000000 + Math.random() * 9000000).toString()
        // create expire code date
        const verfiyCodeExpier = new Date()
        verfiyCodeExpier.setHours(verfiyCodeExpier.getHours() + 1)

        // checking Exist User by name
        if (userNameExist) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "User name is already used"
            })

        }

        // checking Exist User by email
        if (emailExist) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "This email already use"
            })

        }

        // checking Exist email and verified
        if (emailExist?.isVerfiyed) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "User already Vefiyed!"
            })
        } else {
            // hash password
            const hashPassword: String = await bcrypt.hash(password, 10)


            const newUser = await Users.create({
                username: username,
                password: hashPassword,
                email: email,
                image: image,
                number: number,
                verfiyCode: verfiyCode,
                verfiyCodeExpier: verfiyCodeExpier,
                semester
            })

            // Send verification email
            await sendEmail({ image: image, name: username, receiver: email, subject: "Email Verfication", code: verfiyCode, })

            return sendResponse<any>(res, {
                statusCode: httpStatus.OK, success: true, data: newUser, message: "Create Data Successfully",
            })

        }

    } catch (error) {
        return sendResponse<any>(res, {
            statusCode: httpStatus.UNAUTHORIZED, success: true, data: error, message: "User not Created"
        })
    }

}

const SignIn = async (req: Request, res: Response) => {
    try {
        const { password, email } = req.body;

        const findUserByEmail = await Users.findOne({ email });
        if (!findUserByEmail) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.UNAUTHORIZED, success: false, data: null, message: "User not found"
            });
        }

        const { password: hashPassword } = findUserByEmail;
        const isPasswordMatch = await bcrypt.compare(password, hashPassword);
        if (!isPasswordMatch) {
            return sendResponse<any>(res, {
                statusCode: httpStatus.UNAUTHORIZED, success: false, data: null, message: "Password doesn't match."
            });
        }

        const { suspend, isVerfiyed, role } = findUserByEmail
        const id: String = findUserByEmail?.id

        // Create the token
        const token = createToken({ isVerfiyed, role, suspend, user_id: id });


        // Set the cookie with the token
        res.cookie('authToken', token, {
            httpOnly: true, // Cookie cannot be accessed via JavaScript
            // secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
            maxAge: 3600000, // 1 hour (cookie expiration)
            sameSite: 'strict', // Protect against CSRF attacks
        });

        return sendResponse<any>(res, {
            statusCode: httpStatus.OK, success: true, data: { token }, message: "User authenticated successfully"
        });
    } catch (error) {
        return sendResponse<any>(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR, success: false, data: error, message: "An error occurred"
        });
    }
}

const getUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const findUserById = await Users.findById(userId);
        console.log(findUserById, 'get user');
        return sendResponse<any>(res, { statusCode: httpStatus.OK, success: true, data: findUserById, message: 'Get user successfully' })
    } catch (error) {
        return sendResponse<any>(res, { statusCode: httpStatus.FORBIDDEN, success: true, data: error, message: 'Forbidden', })
    }

}

const verifiyUser = async (req: Request, res: Response) => {
    const reqPerams = req.params.otp;
    const findByOTP = await Users.findOne({
        'verfiyCode': reqPerams
    })
    if (!findByOTP) {
        return sendResponse<any>(res, { statusCode: httpStatus.NOT_FOUND, success: false, data: findByOTP, message: 'OTP are not matched', })
    } else {
        const { verfiyCodeExpier, createdAt } = findByOTP;
        const created_date = relativeDate(createdAt)
        const Expier_date = relativeDate(verfiyCodeExpier)

        if (created_date >= Expier_date) {
            return sendResponse<any>(res, { statusCode: httpStatus.EXPECTATION_FAILED, success: false, message: 'OTP are unvalid, time over', })
        } else {
            const verified = await Users.updateOne({
                'verfiyCode': reqPerams,
            }, { isVerfiyed: true })

            console.log(verified, 'true');

            if (verified.modifiedCount === 1) {
                const verifiedData = await Users.updateOne({ 'verfiyCode': reqPerams }, { verfiyCode: null, verfiyCodeExpier: null })
                console.log(verifiedData, 'clear');
                return sendResponse<any>(res, { statusCode: httpStatus.OK, success: true, message: 'User Verifiyed Successfully', })
            } else {
                return sendResponse<any>(res, { statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: 'Forbidden' })
            }
        }

    }
}

// recover pass
const forgotPass = async (req: Request, res: Response) => {
    const reqPerams = req.params.email;

    const findByEmail = await Users.findOne({ email: reqPerams });
    if (!findByEmail) {
        return sendResponse<any>(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'This email is not register', })
    } else {
        const verfiyCode = Math.floor(1000000 + Math.random() * 9000000).toString()
        const verfiyCodeExpier = new Date()
        verfiyCodeExpier.setHours(verfiyCodeExpier.getHours() + 1)

        const { image, username, email } = findByEmail

        const updateUserOtp = await Users.updateOne({
            email: reqPerams
        }, {
            verfiyCode: verfiyCode,
            verfiyCodeExpier: verfiyCodeExpier
        })
        // Send verification email
        await sendEmail({ image: image, name: username, receiver: email, subject: "Email Verfication", code: verfiyCode })
        return sendResponse<any>(res, {
            statusCode: httpStatus.OK, success: true, data: updateUserOtp, message: "Email are matched, Check your mail & verify user code",
        })
    }
}

const verfiyPass = async (req: Request, res: Response) => {
    const reqPerams = req.params.otp;
    const findByOTP = await Users.findOne({
        'verfiyCode': reqPerams
    })
    if (!findByOTP) {
        return sendResponse<any>(res, { statusCode: httpStatus.NOT_FOUND, success: false, data: findByOTP, message: 'OTP are not matched', })
    } else {
        const { verfiyCodeExpier, createdAt } = findByOTP;
        const created_date = relativeDate(createdAt)
        const Expier_date = relativeDate(verfiyCodeExpier)

        if (created_date >= Expier_date) {
            return sendResponse<any>(res, { statusCode: httpStatus.EXPECTATION_FAILED, success: false, message: 'OTP are unvalid, time over', })
        } else {
            return sendResponse<any>(res, { statusCode: httpStatus.OK, success: true, message: 'OTP are Matched' })
        }
    }
}

const setNewPass = async (req: Request, res: Response) => {
    const { email, password } = req.params;
    const findByEmail = await Users.findOne({ email: email });
    if (!findByEmail) {
        return sendResponse<any>(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'Your email are not matched', })
    } else {
        const hashPassword: String = await bcrypt.hash(password, 10)

        const updateNewPass = await Users.updateOne({ email: email }, { password: hashPassword });
        if (updateNewPass.matchedCount === 1) {
            return sendResponse<any>(res, { statusCode: httpStatus.OK, success: true, message: 'Your new password set successfully', })
        } else {
            return sendResponse<any>(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'Something want wrong, your password not update', })
        }
    }
}

export default { SingUp, SignIn, getUser, verifiyUser, forgotPass, verfiyPass, setNewPass }