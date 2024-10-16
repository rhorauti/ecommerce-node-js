export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createAt?: Date;
  updateAt?: Date;
  emailConfirmed: boolean;
}
