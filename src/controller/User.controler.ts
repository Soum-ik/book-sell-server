import type { Request, Response } from 'express';
import Users from "../models/User.model";
import sendResponse from '../libs/utility/sendResponse';
import httpStatus from 'http-status';
import sendEmail from '../libs/hepler/Email/emaliSend';
import bcrypt from "bcrypt"
import { createToken } from '../libs/hepler/auth/jwtHelper';



const SingUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password, number, image } = await req.body;

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

        // checking Exist User
        if (userNameExist) {
            sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "User name is already used"
            })

        }


        if (emailExist) {
            sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "This email already use"
            })

        }

        // checking Exist email
        if (emailExist?.isVerfiyed) {
            sendResponse<any>(res, {
                statusCode: httpStatus.NOT_ACCEPTABLE, success: false, message: "User already Vefiyed!"
            })
        } else {
            // hash password
            const hashPassword: String = await bcrypt.hash(password, 10)
            console.log(hashPassword, "hashpassword");

            const newUser = await Users.create({
                username: username,
                password: hashPassword,
                email: email,
                image: image,
                number: number,
                verfiyCode: verfiyCode,
                verfiyCodeExpier: verfiyCodeExpier
            })

            // Send verification email
            const emaliSend = await sendEmail({ image: image, name: username, receiver: email, subject: "Email Verfication" })

            console.log(emaliSend, "chceking reply");


            sendResponse<any>(res, {
                statusCode: httpStatus.OK, success: true, data: newUser, message: "Create Data Successfully",
            })

        }

    } catch (error) {
        sendResponse<any>(res, {
            statusCode: httpStatus.UNAUTHORIZED, success: true, data: error, message: "User not Created"
        })
    }

}

const SignIn = async (req: Request, res: Response) => {
    try {
        const { password, email } = req.body;

        const findUserByEmail = await Users.findOne({ email });
        if (!findUserByEmail) {
            return sendResponse(res, {
                statusCode: httpStatus.UNAUTHORIZED, success: false, data: null, message: "User not found"
            });
        }

        const { password: hashPassword } = findUserByEmail;
        const isPasswordMatch = await bcrypt.compare(password, hashPassword);
        if (!isPasswordMatch) {
            return sendResponse(res, {
                statusCode: httpStatus.UNAUTHORIZED, success: false, data: null, message: "Password doesn't match."
            });
        }

        const { suspend, isVerfiyed, role } = findUserByEmail

        // Convert user ID to string
        const user_id = findUserByEmail._id.toString();

        // Create the token
        const token = createToken({ isVerfiyed, role, suspend, user_id });

       

        return sendResponse(res, {
            statusCode: httpStatus.OK, success: true, data: { token }, message: "User authenticated successfully"
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR, success: false, data: error, message: "An error occurred"
        });
    }
}

export default { SingUp, SignIn }authenticate 