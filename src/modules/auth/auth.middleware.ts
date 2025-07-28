/* eslint-disable @typescript-eslint/dot-notation */
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import { roleRights } from '../../config/roles';
import { IUserDoc } from '../user/user.interfaces';

interface RequestWithUser extends ExpressRequest {
  user: IUserDoc;
}

const verifyCallback =
  (req: RequestWithUser, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: ExpressRequest, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req as RequestWithUser, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
