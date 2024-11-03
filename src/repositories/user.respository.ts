import { IUser } from '@src/core/interfaces/IUser';
import { UserModel } from '@src/models/user.model';
import { injectable } from 'inversify';

@injectable()
export class UserRepository {
  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find().select('-password').exec();
  }

  async findUser(email: string): Promise<IUser> {
    return await UserModel.findOne({ email: email });
  }

  async createNewData(userData: IUser): Promise<IUser> {
    return await UserModel.create(userData);
  }

  async updateData(data: IUser): Promise<IUser> {
    return await UserModel.findOneAndUpdate({ _id: data.id }, data, { new: true });
  }
}
