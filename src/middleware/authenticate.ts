import { Request, Response, NextFunction } from 'express';
import { ErrorMessages } from '../messages/error';
import { decode } from 'jsonwebtoken';
import { TokenPayload } from '../types';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send(ErrorMessages.NO_TOKEN);
  }

  try {
    const decodedToken = decode(token.split(' ')[1]);

    if (!decodedToken || !(decodedToken as TokenPayload).id)
      throw new Error(ErrorMessages.INVALID_TOKEN);

    res.locals.customerId = (decodedToken as TokenPayload).id;
    next();
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : ErrorMessages.INVALID_TOKEN;
    return res.status(401).send(message);
  }
}
