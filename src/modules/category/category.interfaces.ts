/* eslint-disable prettier/prettier */
import { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ICategory {
  name: string;
  description: string;
}

export interface ICategoryDoc extends ICategory, Document {}

export interface ICategoryModel extends Model<ICategoryDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type NewCreateCategory = {
  name: string;
  description: string;
};

export type UpdateCategoryBody = {
  name?: string;
  description?: string;
};
