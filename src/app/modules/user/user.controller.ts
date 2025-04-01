import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = req.body;
    const result = await UserServices.createUser(user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await UserServices.loginUser(email, password);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Login code send to your email',
        data: result,
    });
});




const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    await UserServices.changePasswordToDB(user, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully',
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.body;
    console.log(req.body);
    const payload = req.body;
    await UserServices.resetPasswordToDB(token, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successful',
        data: null,
    });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserServices.verifyEmailToDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Email verified successfully',
        data: result,
    });
});


const verifyLogin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserServices.verifyLogin(payload);
    sendResponse(res, { 
        statusCode: httpStatus.OK,
        success: true,
        message: 'Login verification successful',
        data: result,
    });
});
const sendCodeToEmailForForgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await UserServices.sendCodeToEmailForForgetPassword(email);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Code sent to email successfully',
        data: result,
    });
}
);
export const UserController = {
    createUser,
    getSingleUser,
    loginUser,
    changePassword,
    resetPassword,
    verifyLogin,
    verifyEmail,
    sendCodeToEmailForForgetPassword,
    
};