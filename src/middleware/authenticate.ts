import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { User } from '../types';
import { ErrorMessages } from '../messages/error';

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
    const user = (
      await axios.get<User & { id: string }>(`https://dummyjson.com/auth/me`, {
        headers: {
          Authorization: token,
        },
      })
    ).data;
    res.locals.customerId = user.id;
    next();
  } catch (e) {
    return res.status(401).send(ErrorMessages.INVALID_TOKEN);
  }
}
