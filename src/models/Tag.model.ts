import { Schema, model, Document } from "mongoose";
export interface ITag extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
const tagSchema = new Schema<ITag>(
  {
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
  },
  {
    timestamps: true,
  }
);
const Tag = model<ITag>("Tag", tagSchema);
export default Tag;