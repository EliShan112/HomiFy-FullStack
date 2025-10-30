import { Schema, model, Document, Types } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUser extends Document{
    _id: Types.ObjectId;
    email: string;
    username: string;

}

const userSchema = new Schema<IUser>({
    email: {
        type: String, 
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);

export const User = model<IUser>('User', userSchema);   