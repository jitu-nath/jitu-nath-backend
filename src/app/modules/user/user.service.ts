/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import generateOTP from "../../utils/generateOTP";
import { emailTemplate } from "../../utils/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import config from "../../config";
const createUser = async (user: TUser) => {
  const result = await User.create(user);
  return result;
};
const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const loginUser = async (email: string, password: string) => {
  const validUser = await User.findOne({ email, password });
  if (!validUser) {
    throw new Error("Invalid email or password");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    name: validUser.name,
    email: validUser.email,
  };
  const verifyLogin = emailTemplate.verifyLogin(value);

  emailHelper.sendEmail(verifyLogin);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };

  await User.findOneAndUpdate({ email }, { $set: { authentication } });

  return {
    user: validUser,
  };
};
const changePasswordToDB = async (user: any, payload: any) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select("+password");
  if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  //current password check
  const isPasswordMatched = await User.findOne({
    email: isExistUser.email,
    password: currentPassword,
  });
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Current password is wrong!");
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please give different password from current password",
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password and Confirm password doesn't matched",
    );
  }

  const updateData = {
    password: newPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });

  const value = {
    receiver: isExistUser._id,
    text: "Your password changed successfully",
  };
};
const sendCodeToEmailForForgetPassword = async (email: string) => {
  //isExist user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }
  const otp = generateOTP();
  const value = {
    otp,
    email,
    name: user.name,
  };
  const verifyEmail = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(verifyEmail);
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });

  return {
    user: user,

  };
};

//forget password
const resetPasswordToDB = async (token: any, payload: any) => {
  const { newPassword, confirmPassword } = payload;
  console.log(token, "token");
  //isExist token
  const isExistToken = await User.findOne({
    resetToken: token,
  });
  console.log(isExistToken, "isExistToken");
  if (!isExistToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  //user permission check
  const isExistUser = await User.findById(isExistToken._id).select(
    "+authentication",
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'",
    );
  }

  //validity check
  const currentDate = new Date();
  const isValid = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: currentDate },
  });
  if (!isValid) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Token expired, Please click again to the forget password",
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and Confirm password doesn't match!",
    );
  }

  const updateData = {
    password: newPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistUser._id }, updateData, {
    new: true,
  });
};
//verify email
const verifyEmailToDB = async (payload: any) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email }).select("+authentication");
  if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }
  if (!oneTimeCode) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please give the otp, check your email we send a code",
    );
  }
  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "You provided wrong otp");
  }

  const date = new Date();
  if (!isExistUser.authentication?.expireAt) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Otp already expired, Please try again",
    );
  }
  if (date > isExistUser.authentication?.expireAt) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Otp already expired, Please try again",
    );
  }

  await User.findOneAndUpdate(
    { _id: isExistUser._id },
    {
      authentication: {
        isResetPassword: true,
        oneTimeCode: null,
        expireAt: null,
      },
    },
  );

  //create token ;
  const createToken = crypto.randomBytes(32).toString("hex");

  await User.findOneAndUpdate(
    { _id: isExistUser._id },
    {
      resetToken: createToken,
      resetTokenExpiration: new Date(Date.now() + 5 * 60000),
    },
  );
  const message =
    "Verification Successful: Please securely store and utilize this code for reset password";
  const data = createToken;

  return { data, message };
};
//verify login
const verifyLogin = async (payload: any) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email }).select("+authentication");
  if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please give the otp, check your email we send a code",
    );
  }

  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "You provided wrong otp");
  }

  const date = new Date();
  if (!isExistUser.authentication?.expireAt) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Otp already expired, Please try again",
    );
  }
  if (date > isExistUser.authentication?.expireAt) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Otp already expired, Please try again",
    );
  }

  await User.findOneAndUpdate(
    { _id: isExistUser._id },
    {
      authentication: {
        isResetPassword: true,
        oneTimeCode: null,
        expireAt: null,
      },
    },
  );

  //create token ;
  const accessToken = jwt.sign(
    {
      id: isExistUser._id,
      email: isExistUser.email,
      name: isExistUser.name,
    },
    config.jwt_access_secret!,
    {
      expiresIn: "1y",
    },
  );

  return { accessToken };
};

export const UserServices = {
  createUser,
  getSingleUser,
  loginUser,
  changePasswordToDB,
  resetPasswordToDB,
  verifyEmailToDB,
  verifyLogin,
  sendCodeToEmailForForgetPassword
};
