import { Schema, model, connect } from "mongoose";
interface IUser {
  name: string;
  email: string;
  password: string;
  lastLogin: Date;
  isVerified: boolean;
  resetPasswordToken: string | any;
  resetPasswordExpiresAt: Date |  any;
  verificationToken: String | any;
  verificationTokenExpiresAt: Date |any;
}
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },

  {
    timestamps: true,
  }
);
const User =  model<IUser>('User'  ,UserSchema)

export {UserSchema ,User }
