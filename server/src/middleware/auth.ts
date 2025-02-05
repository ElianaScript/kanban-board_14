import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
  password: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({error: "Access Denied. No token provided."});
    return;
  }

  jwt.verify(token, JWT_SECRET_KEY, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined ) => {
    if (err || !decoded || typeof decoded === 'string') {
     res.status(403).json({error: "InvalidToken."});
     return;
    }
    const payload = decoded as JwtPayload;
    if (!payload.username || !payload.password) {
      res.status(403).json({error: "Invalid token payload."})
      return;
    }


  req.user = payload;
  next();
  });
};
