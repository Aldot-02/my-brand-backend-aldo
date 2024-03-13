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
        req.user = user;
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
exports.isAdmin = isAdmin;
//# sourceMappingURL=middlewares.js.map