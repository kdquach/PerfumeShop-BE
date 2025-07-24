import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  gender: string;
  role: string;
  provider: string;
  isEmailVerified: boolean;
  avatar?: string;
}

// Interface for document with temporary password field
export interface IUserWithPassword extends IUser {
  password?: string; // Temporary field for password before hashing
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = {
  name?: string;
  email?: string;
  password?: string;
  passwordHash?: string;
  phone?: string;
  address?: string;
  gender?: string;
  role?: string;
  provider?: string;
  isEmailVerified?: boolean;
  avatar?: string;
};

export type NewRegisteredUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  avatar?: string;
};

export type NewCreatedUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  role: string;
  provider: string;
  avatar?: string;
};

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
