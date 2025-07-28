/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Product from './product.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreateProduct, UpdateProductBody, IProductDoc } from './product.interfaces';
import { logger } from '../logger';

/**
 * Create a product
 * @param {NewCreateProduct} productBody
 * @return {Promise<IProductDoc>}
 */
export const createProduct = async (userBody: NewCreateProduct): Promise<IProductDoc> => {
  logger.debug(`Creating product with body: ${JSON.stringify(userBody)}`);
  return Product.create(userBody);
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> => Product.findById(id);

/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {UpdateProductBody} updateBody
 * @returns {Promise<IProductDoc | null>}
 */
export const updateProductById = async (
  productId: mongoose.Types.ObjectId,
  updateBody: UpdateProductBody
): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.deleteOne();
  return product;
};
