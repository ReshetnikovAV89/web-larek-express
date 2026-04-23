import mongoose, { Schema } from "mongoose";

export interface IUserToken {
  token: string;
}

export interface IUser {
  name?: string;
  email: string;
  password: string;
  tokens?: IUserToken[];
}

const tokenSchema = new Schema<IUserToken>(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ё-мое",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  tokens: {
    type: [tokenSchema],
    default: [],
    select: false,
  },
});

export default mongoose.model<IUser>("user", userSchema);
