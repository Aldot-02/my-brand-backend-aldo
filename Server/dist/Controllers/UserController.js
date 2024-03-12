"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUser = exports.getProfile = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Getting a Personal information
const getProfile = async (req, res) => {
    const user = req.user;
    try {
        const userProfile = await UserModel_1.default.findById(user._id).select('-password').lean().exec();
        if (userProfile) {
            res.status(200).json(userProfile);
            return;
        }
        else {
            res.status(404).json({ message: "User Doesn't exist" });
            return;
        }
    }
    catch (error) {
        res.status(500).json(error);
        return;
    }
};
exports.getProfile = getProfile;
// Getting a single user
const getUser = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        if (user._id.toString() === id || user.isAdmin) {
            const userToGet = await UserModel_1.default.findById(id).select('-password').lean().exec();
            if (userToGet) {
                res.status(200).json(userToGet);
                return;
            }
            else {
                res.status(404).json({ message: "User Doesn't exist" });
                return;
            }
        }
        else {
            res.status(403).json({ message: "You are not allowed to access this Profile" });
            return;
        }
    }
    catch (error) {
        res.status(500).json(error);
        return;
    }
};
exports.getUser = getUser;
// Getting all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel_1.default.find().select('-password').lean().exec();
        res.status(200).send(users);
        return;
    }
    catch (error) {
        res.status(500).json(error);
        return;
    }
};
exports.getAllUsers = getAllUsers;
// Updating user's Information
const updateUser = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        if (user._id.toString() === id || user.isAdmin) {
            if (req.body.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                req.body.password = await bcrypt_1.default.hash(req.body.password, salt);
            }
            const updatedUser = await UserModel_1.default.findByIdAndUpdate(id, req.body, { new: true }).select('-password').lean().exec();
            res.status(200).json(updatedUser);
            return;
        }
        else {
            res.status(403).json({ message: "You are not allowed to update this Profile" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
};
exports.updateUser = updateUser;
// Deleting a User
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        if (user._id.toString() === id || user.isAdmin) {
            await UserModel_1.default.findByIdAndDelete(id);
            res.status(200).json({ message: "Account deleted successfully" });
            return;
        }
        else {
            res.status(403).json({ message: "You are not allowed to delete this account" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=UserController.js.map