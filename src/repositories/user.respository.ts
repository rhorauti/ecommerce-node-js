import { IUser } from '@src/core/interfaces/IUser';
import { User } from '@src/models/user.model';
import { injectable } from 'inversify';

@injectable()
export class UserRepository {
  async getAllData(): Promise<IUser[]> {
    return await User.find();
  }

  async findUser(email: string): Promise<IUser> {
    return await User.findOne({ email: email });
  }

  async createNewData(userData: IUser): Promise<IUser> {
    return await User.create(userData);
  }
}
