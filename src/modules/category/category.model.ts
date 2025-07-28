/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICategoryDoc, ICategoryModel } from './category.interfaces';

const categorySchema = new mongoose.Schema<ICategoryDoc, ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model<ICategoryDoc, ICategoryModel>('Category', categorySchema);

export default Category;
