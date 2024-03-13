import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import UserModel from '../Models/UserModel';

export interface CustomRequest extends Request {
    user?: any; 
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.cookies['access'];
        
        if (!accessToken) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }

        const payload: any = verify(accessToken, "access_secret");

        if (!payload) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }

        const user = await UserModel.findOne({ _id: payload.id });

        if (!user) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }
        
        req.user = user;
        
        next();
    } catch (e) {
        res.status(401).send({
            message: 'unauthenticated'
        });
        return;
    }
}


export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        res.status(404).send({
            message: 'User not found'
        });
        return;
    }

    if (!user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized, admin access required" });
    }

    next();
};