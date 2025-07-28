/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable import/prefer-default-export */
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as categoryService from './category.service';
import logger from '../logger/logger';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  logger.debug(`Creating category with body: ${JSON.stringify(req.body)}`);
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Category created successfully',
    data: category.toJSON(),
  });
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const data = await categoryService.queryCategories(filter, options);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Categories fetched successfully',
    data, // result nên bao gồm: results, page, totalPages, totalResults, limit
  });
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
  }

  const category = await categoryService.getCategoryById(new mongoose.Types.ObjectId(categoryId));
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Category fetched successfully',
    data: category,
  });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
  }

  const category = await categoryService.UpdateCategoryById(new mongoose.Types.ObjectId(categoryId), req.body);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Category updated successfully',
    data: category,
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
  }

  await categoryService.deleteCategoryById(new mongoose.Types.ObjectId(categoryId));
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Category deleted successfully',
  });
});
