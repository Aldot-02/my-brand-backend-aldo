import { Request, Response } from 'express';
import UserModel, { User } from "../Models/UserModel.js";
import bcrypt from 'bcrypt';
import { RequestWithUser } from '../Middlewares/middlewares'

// Getting a Personal information
export const getProfile = async (req: RequestWithUser, res: Response): Promise<void> => {
    const user: User = req.user;

    try {
        const userProfile: User | null = await UserModel.findById(user._id).select('-password').lean<User>().exec();

        if (userProfile) {
            res.status(200).json(userProfile);
        } else {
            res.status(404).json({message: "User Doesn't exist"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Getting a single user
export const getUser = async (req: RequestWithUser, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const user: User = req.user;

    try {
        if (user._id.toString() === id || user.isAdmin) {
            const userToGet: User | null = await UserModel.findById(id).select('-password').lean<User>().exec();

            if (userToGet) {
                res.status(200).json(userToGet);
            } else {
                res.status(404).json({message: "User Doesn't exist"});
            }
        } else {
            res.status(403).json({message: "You are not allowed to access this Profile"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Getting all users
export const getAllUsers = async (req: Request, res: Response) : Promise<void> => {
    try {
        const users: User[] = await UserModel.find().select('-password').lean<User[]>().exec();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).json(error);
    }
}

// Updating user's Information
export const updateUser = async (req: RequestWithUser, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const user: User = req.user;

    try {
        if (user._id.toString() === id || user.isAdmin) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            const updatedUser: User | null = await UserModel.findByIdAndUpdate(id, req.body, { new: true }).select('-password').lean<User>().exec();

            res.status(200).json(updatedUser);
        } else {
            res.status(403).json({message: "You are not allowed to update this Profile"});
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Deleting a User
export const deleteUser = async (req: RequestWithUser, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const user: User = req.user;

    try {
        if (user._id.toString() === id || user.isAdmin) {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Account deleted successfully" });
        } else {
            res.status(403).json({ message: "You are not allowed to delete this account" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};