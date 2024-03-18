"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Refresh = exports.AuthenticatedUser = exports.loginUser = exports.registerUser = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign, verify } = jsonwebtoken_1.default;
const registerUser = async (req, res) => {
    const { firstname, lastname, email, password, isAdmin } = req.body;
    if (!firstname) {
        res.status(400).json({ message: "First Name is required" });
        return;
    }
    else if (!lastname) {
        res.status(400).json({ message: "Last Name is required" });
        return;
    }
    else if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    else if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
    }
    try {
        const existingUser = await UserModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Account already exists with this email.' });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = new UserModel_1.default({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false
        });
        await newUser.save();
        res.status(200).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    else if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
    }
    try {
        const user = await UserModel_1.default.findOne({ email });
        if (user) {
            const validity = await bcrypt_1.default.compare(password, user.password);
            if (!validity) {
                res.status(400).json({ message: "Wrong Credentials" });
                return;
            }
            // ACCESS TOKEN
            const accessToken = sign({ id: user._id, isAdmin: user.isAdmin }, "access_secret", { expiresIn: '10m' });
            // REFRESH TOKEN
            const refreshToken = sign({ id: user._id, isAdmin: user.isAdmin }, "refresh_secret", { expiresIn: '1w' });
            res.cookie("access", accessToken, {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                sameSite: 'none',
                secure: true,
                httpOnly: true
            });
            res.cookie("refresh", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
                sameSite: 'none',
                secure: true,
                httpOnly: true
            });
            res.status(200).json({ accessToken, isAdmin: user.isAdmin });
            return;
        }
        else {
            res.status(404).json({ message: "User not found" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
};
exports.loginUser = loginUser;
// Getting Authenticated User
const AuthenticatedUser = async (req, res) => {
    try {
        const accessToken = req.cookies['access'];
        if (!accessToken) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }
        const payload = verify(accessToken, "access_secret");
        if (!payload) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }
        const user = await UserModel_1.default.findOne({ _id: payload.id });
        if (!user) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }
        res.status(200).json(user);
    }
    catch (e) {
        res.status(401).send({
            message: 'unauthenticated'
        });
        return;
    }
};
exports.AuthenticatedUser = AuthenticatedUser;
// REFRESHING THE TOKEN
const Refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies['refresh'];
        const payload = verify(refreshToken, "refresh_secret");
        if (!payload) {
            res.status(401).json({
                message: 'unauthenticated'
            });
        }
        const accessToken = sign({ id: payload.id }, "access_secret", { expiresIn: '1m' });
        res.cookie("access", accessToken, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'none',
        });
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthenticated' });
    }
};
exports.Refresh = Refresh;
const Logout = async (req, res) => {
    res.cookie('access', 'deleted', { maxAge: -1 });
    res.cookie('refresh', 'deleted', { maxAge: -1 });
    res.status(200).json({ message: "Logout was successful" });
};
exports.Logout = Logout;
//# sourceMappingURL=AuthController.js.map