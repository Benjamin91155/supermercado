import { Schema, model, models, type Document, type Model } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryDocument = ICategory & Document;

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

const Category =
  (models.Category as Model<CategoryDocument>) || model<CategoryDocument>("Category", categorySchema);

export default Category;
