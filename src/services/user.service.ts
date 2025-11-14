import { UserModel } from "../models/user.model";
import { User } from "../models/user.types";

export class UserService {
  async getProfileById(userId: string): Promise<User | null> {
    const user = await UserModel.findById(userId);
    return user;
  }

  async getProfileByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user;
  }
}

