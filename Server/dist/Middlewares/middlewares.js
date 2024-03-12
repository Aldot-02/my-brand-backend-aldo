"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const isAuthenticated = async (req, res, next) => {
    try {
        const accessToken = req.cookies['access'];
        if (!accessToken) {
            res.status(401).send({
                message: 'unauthenticated'
            });
            return;
        }
        const payload = (0, jsonwebtoken_1.verify)(accessToken, "access_secret");
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
        next();
    }
    catch (e) {
        res.status(401).send({
            message: 'unauthenticated'
        });
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = async (req, res, next) => {
    try {
        const accessToken = req.cookies['access'];
        if (!accessToken) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
        const payload = (0, jsonwebtoken_1.verify)(accessToken, "access_secret");
        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
        const user = await UserModel_1.default.findOne({ _id: payload.id });
        if (!user) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
        // Check if the user is an admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: "Unauthorized, admin access required" });
        }
        // If the user is an admin, proceed
        res.status(200).json(user);
        next();
    }
    catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=middlewares.js.map