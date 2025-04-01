/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  
  image: string;
  resetToken: string;
  resetTokenExpiration: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type TUserModel = {
  isExistToken(token: string): any;
  isExpireToken(token: string): boolean;
} & Model<TUser>;
