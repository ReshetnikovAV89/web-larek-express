import mongoose, { Schema } from 'mongoose';

export interface IProductImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IProductImage;
  category: string;
  description?: string;
  price?: number | null;
}

const imageSchema = new Schema<IProductImage>(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
