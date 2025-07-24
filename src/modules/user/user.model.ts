import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { roles } from '../../config/roles';
import { IUserDoc, IUserModel, IUserWithPassword } from './user.interfaces';

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
      private: true, // used by the toJSON plugin
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate(value: string) {
        if (!validator.isMobilePhone(value, 'vi-VN')) {
          throw new Error('Invalid phone number');
        }
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if password matches the user's password hash
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  if (!user.passwordHash) {
    return false;
  }
  return bcrypt.compare(password, user.passwordHash);
});

userSchema.pre('save', async function (next) {
  const user = this as mongoose.Document & IUserWithPassword;
  if (user.isModified('password') && user.password) {
    user.passwordHash = await bcrypt.hash(user.password, 12);
    delete user.password;
  }
  next();
});

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;
