/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Category from './category.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreateCategory, UpdateCategoryBody, ICategoryDoc } from './category.interfaces';
import { logger } from '../logger';

/**
 * Create a category
 * @param {NewCreateCategory} categoryBody
 * @return {Promise<ICategoryDoc>}
 */
export const createCategory = async (userBody: NewCreateCategory): Promise<ICategoryDoc> => {
  logger.debug(`Creating category with body: ${JSON.stringify(userBody)}`);
  return Category.create(userBody);
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCategories = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

/**
 * Get category by id
 * @param {mongoose.Types.ObjectId} id
 * @return {Promise<ICategoryDoc | null>}
 */
export const getCategoryById = async (id: mongoose.Types.ObjectId): Promise<ICategoryDoc | null> => Category.findById(id);

/**
 * Update category by id
 * @param {mongoose.Types.ObjectId} categoryId
 * @param {UpdateCategoryBody} updateBody
 * @returns {Promise<ICategoryDoc | null>}
 */
export const UpdateCategoryById = async (
  categoryId: mongoose.Types.ObjectId,
  updateBody: UpdateCategoryBody
): Promise<ICategoryDoc | null> => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete by id
 * @param {mongoose.Types.ObjectId} categoryId
 * @returns {Promise<ICategoryDoc | null >}
 */
export const deleteCategoryById = async (categoryId: mongoose.Types.ObjectId): Promise<ICategoryDoc | null> => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.deleteOne();
  return category;
};
