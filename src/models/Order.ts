import { Schema, model, models, type Document, type Model, type Types } from "mongoose";

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
export type PaymentMethod = "cash" | "card" | "transfer";
export type StoreBranch = "central" | "north";
export type FulfillmentType = "delivery" | "pickup";

export interface OrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface IOrder {
  user: Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  branch: StoreBranch;
  fulfillment: FulfillmentType;
  scheduledSlot?: string;
  deliveryAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = IOrder & Document;

const orderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: "" }
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending"
    },
    paymentMethod: { type: String, enum: ["cash", "card", "transfer"], default: "card" },
    branch: { type: String, enum: ["central", "north"], default: "central" },
    fulfillment: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
    scheduledSlot: { type: String, default: "" },
    deliveryAddress: { type: String, default: "" }
  },
  { timestamps: true }
);

const Order = (models.Order as Model<OrderDocument>) || model<OrderDocument>("Order", orderSchema);

export default Order;
