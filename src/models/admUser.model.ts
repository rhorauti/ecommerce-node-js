import mongoose, { Schema } from 'mongoose';

const admUserSchema = new Schema(
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
    accessLevel: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const AdmUser = mongoose.model('AdmUser', admUserSchema);
