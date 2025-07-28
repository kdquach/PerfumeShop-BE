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
import * as productService from './product.service';
import logger from '../logger/logger';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  logger.debug(`Creating product with body: ${JSON.stringify(req.body)}`);
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Product created successfully',
    data: product.toJSON(),
  });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'categoryId']);
  if (filter.categoryId && typeof filter.categoryId === 'string') {
    const isValid = mongoose.Types.ObjectId.isValid(filter.categoryId);
    if (!isValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid categoryId');
    }
    filter.categoryId = new mongoose.Types.ObjectId(filter.categoryId);
  }

  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await productService.queryProducts(filter, options);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Products fetched successfully',
    data: result,
  });
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  const product = await productService.getProductById(new mongoose.Types.ObjectId(productId));
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Product fetched successfully',
    data: product,
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  const product = await productService.updateProductById(new mongoose.Types.ObjectId(productId), req.body);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Product updated successfully',
    data: product,
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  await productService.deleteProductById(new mongoose.Types.ObjectId(productId));
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Product deleted successfully',
  });
});
