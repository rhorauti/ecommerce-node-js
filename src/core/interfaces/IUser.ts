export interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createAt?: Date;
  updateAt?: Date;
  emailConfirmed: boolean;
}
