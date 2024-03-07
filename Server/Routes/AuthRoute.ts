/**
 * @openapi
 * tags:
 *   name: Authentication
 */


import express, { Router } from 'express';
import { AuthenticatedUser, Logout, Refresh, loginUser, registerUser } from '../Controllers/AuthController.js';

const router: Router = express.Router();

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
 *               - isAdmin
 *     responses:
 *       200:
 *         description: User registered successfully
 *       409:
 *         description: Account already exists with this email
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerUser);

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
router.post('/login', loginUser);
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
router.get('/authenticated', AuthenticatedUser);

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
router.post('/refresh', Refresh);

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
router.post('/logout', Logout);

export default router;