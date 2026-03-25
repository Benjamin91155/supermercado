import { Schema, model, models, type Document, type Model, type Types } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  category: Types.ObjectId;
  stock: number;
  imageUrl?: string;
  description: string;
  isFeatured: boolean;
  isOffer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = IProduct & Document;

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product =
  (models.Product as Model<ProductDocument>) || model<ProductDocument>("Product", productSchema);

export default Product;
