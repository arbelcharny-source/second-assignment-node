import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  fullName: string;
}

export const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", userSchema);