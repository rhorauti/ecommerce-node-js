import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
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
    avatar: {
      type: String,
      required: false,
    },
    emailConfirmed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
