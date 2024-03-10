"use strict";
/**
 * @openapi
 * tags:
 *   name: Authentication
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../Controllers/AuthController");
const router = express_1.default.Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *             required:
 *               - email
 *               - password
 *               - firstname
 *               - lastname
 *     responses:
 *       200:
 *         description: User registered successfully
 *       409:
 *         description: Account already exists with this email
 *       500:
 *         description: Internal server error
 */
router.post('/register', AuthController_1.registerUser);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login as a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Wrong credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/login', AuthController_1.loginUser);
/**
 * @openapi
 * /auth/authenticated:
 *   get:
 *     summary: Get authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved authenticated user
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Internal server error
 */
router.get('/authenticated', AuthController_1.AuthenticatedUser);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', AuthController_1.Refresh);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Internal server error
 */
router.post('/logout', AuthController_1.Logout);
exports.default = router;
//# sourceMappingURL=AuthRoute.js.map