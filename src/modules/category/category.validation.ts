/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
import Joi from 'joi';
import { NewCreateCategory } from './category.interfaces';

const createCategoryBody: Record<keyof NewCreateCategory, any> = {
  name: Joi.string().required(),
  description: Joi.string().required(),
};

export const createCategory = {
  body: Joi.object().keys(createCategoryBody),
};

export const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

export const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

export const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};
