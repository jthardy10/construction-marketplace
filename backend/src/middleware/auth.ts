import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
 user?: {
   userId: string;
   role: string;
 };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
 const authHeader = req.headers['authorization'];
 const token = authHeader && authHeader.split(' ')[1];

 if (token == null) return res.sendStatus(401);

 jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
   if (err) return res.sendStatus(403);
   req.user = user;
   next();
 });
};

export const authorizeRole = (roles: string[]) => {
 return (req: AuthRequest, res: Response, next: NextFunction) => {
   if (!req.user || !roles.includes(req.user.role)) {
     return res.status(403).json({ error: 'Access denied' });
   }
   next();
 };
};
