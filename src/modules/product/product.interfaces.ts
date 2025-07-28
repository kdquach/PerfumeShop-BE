/* eslint-disable prettier/prettier */
import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IProduct {
  name: string;
  brand: string;
  description: string;
  scentProfile: string[];
  price: number;
  stock: number;
  categoryId: mongoose.Types.ObjectId | string;
  imageURLs: string[];
  rating: number;
  gender: string;
  longevity: string;
  createAt: Date;
  updateAt: Date;
}

export interface IProductDoc extends IProduct, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IProductModel extends Model<IProductDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateProductBody = {
  name?: string;
  brand?: string;
  description?: string;
  scentProfile?: string[];
  price?: number;
  stock?: number;
  categoryId?: mongoose.Types.ObjectId | string;
  imageURLs?: string[];
  gender?: string;
  longevity?: string;
  createAt?: Date;
  updateAt?: Date;
};

export type NewCreateProduct = {
  name: string;
  brand: string;
  description: string;
  scentProfile: string[];
  price: number;
  stock: number;
  categoryId: mongoose.Types.ObjectId | string;
  imageURLs: string[];
  gender: string;
  longevity: string;
};
