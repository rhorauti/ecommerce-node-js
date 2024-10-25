import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createAt?: Date;
  updateAt?: Date;
  emailConfirmed: boolean;
}
