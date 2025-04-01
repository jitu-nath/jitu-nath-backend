import mongoose from "mongoose";
import { TUser, TUserModel } from "./user.interface";

const userSchema = new mongoose.Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: 0,
    },
  },
  {
    timestamps: true,
  },
);

//token check
userSchema.statics.isExistToken = async (token: string) => {
  return await User.findOne({ token });
};

//token validity check
userSchema.statics.isExpireToken = async (token: string) => {
  const currentDate = new Date();
  const resetToken = await User.findOne({
    token,
    expireAt: { $gt: currentDate },
  });
  return !!resetToken;
};

export const User =
  mongoose.models.User || mongoose.model<TUser, TUserModel>("User", userSchema);
