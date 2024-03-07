import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt';
// Getting a User
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id).select('-password').lean().exec();
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: "User Doesn't exist" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
};
// Getting all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password').lean().exec();
        res.status(200).send(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
// Updating user's Information
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;
    try {
        if (id === currentUserId || currentUserAdminStatus) {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true }).select('-password').lean().exec();
            ;
            res.status(200).json(user);
        }
        else {
            res.status(403).json({ message: "You are not allowed to update this Profile" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Deleting a User
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;
    try {
        const user = await UserModel.findById(id).select('-password').lean().exec();
        if (user) {
            if (id === currentUserId || currentUserAdminStatus) {
                await UserModel.findByIdAndDelete(id);
                res.status(200).json({ message: "Account deleted successfully" });
            }
            else {
                res.status(403).json({ message: "You are not allowed to delete this account" });
            }
        }
        else {
            res.status(200).json({ message: "User Account doesn't exist" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=UserController.js.map