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
        } else {
            req.user = user;
            next();
        }
    } catch (e) {
        res.status(401).send({
            message: 'unauthenticated'
        });
        return;
    }
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies['access'];
        
        if (!accessToken) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        const payload: any = verify(accessToken, "access_secret");

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        const user = await UserModel.findOne({ _id: payload.id });

        if (!user) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            res.status(403).json({ message: "Unauthorized, admin access required" });
        } else {
            req.user = user;
            next();
        }

        // If the user is an admin, proceed
        // res.status(200).json(user);
        // next();
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
    next()
};
