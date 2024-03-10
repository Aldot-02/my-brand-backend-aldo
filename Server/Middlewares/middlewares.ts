import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ParamsDictionary } from 'express-serve-static-core';
import UserModel from '../Models/UserModel';

export interface RequestWithUser extends Request<ParamsDictionary> {
    userId?: string;
    user?: any;
}

export const isAuthenticated = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
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

        // Find the user based on the id in the payload
        const user = await UserModel.findById(payload.id);

        if (!user) {
            res.status(404).send({
                message: 'User not found'
            });
            return;
        }

        // Add the user to the request object
        req.user = user;

        next();
    } catch (e) {
        res.status(401).send({
            message: 'unauthenticated'
        });
    }
}

export const isAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Access the user directly from req.user
    const user = req.user;

    if (!user) {
        res.status(404).send({
            message: 'User not found'
        });
        return;
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized, admin access required" });
    }

    next();
};