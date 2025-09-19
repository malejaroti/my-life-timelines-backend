// const { Schema, model } = require("mongoose");
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  name: string;
  profilePicture: string;
  friends?:[Schema.Types.ObjectId]
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    username: {
      type: String,
      required: true //Used for friend search without email
    },
    name: {
      type: String,
      required: false
    },
    profilePicture: {
      type: String,
      required: false
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model<IUser>("User", userSchema);

// module.exports = User;
export default User;

