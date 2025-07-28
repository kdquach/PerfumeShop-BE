/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import Joi from 'joi';
import { NewCreateProduct } from './product.interfaces';

const createProductBody: Record<keyof NewCreateProduct, any> = {
  name: Joi.string().required(),
  brand: Joi.string().required(),
  description: Joi.string().required(),
  scentProfile: Joi.array().items(Joi.string()).required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  categoryId: Joi.string().required(),
  imageURLs: Joi.array().items(Joi.string()).required(),
  gender: Joi.string().required(),
  longevity: Joi.string().required(),
};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
};

export const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    categoryId: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      brand: Joi.string(),
      description: Joi.string(),
      scentProfile: Joi.array().items(Joi.string()),
      price: Joi.number(),
      stock: Joi.number(),
      categoryId: Joi.string(),
      imageURLs: Joi.array().items(Joi.string()),
      gender: Joi.string(),
      longevity: Joi.string(),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};
