import { IUser } from "../../models/user";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User extends IUser {
      _id: Types.ObjectId;
      username: string;
      email: string;
    }
  }
}
export {};
