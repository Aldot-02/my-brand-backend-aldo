"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Controllers/UserController");
const middlewares_1 = require("../Middlewares/middlewares");
const router = express_1.default.Router();
/**
 * @openapi
 * tags:
 *   name: Users
 */
/**
 * @openapi
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     required:
 *       - firstname
 *       - lastname
 *       - email
 *       - password
 *     properties:
 *       firstname:
 *         type: string
 *         description: The first name of the user.
 *       lastname:
 *         type: string
 *         description: The last name of the user.
 *       email:
 *         type: string
 *         format: email
 *         description: The email address of the user.
 *       password:
 *         type: string
 *         format: password
 *         description: The password of the user.
 *       isAdmin:
 *         type: boolean
 *         description: Indicates whether the user is an administrator.
 */
/**
 * @openapi
 * /user/profile:
 *   get:
 *     summary: Retrieve the profile of the logged-in user
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A user object
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/profile', middlewares_1.isAuthenticated, UserController_1.getProfile);
/**
 * @openapi
 * /user/:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: An array of user objects
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Unauthorized, admin access required
 *       '500':
 *         description: Internal server error
 */
router.get('/', middlewares_1.isAdmin, UserController_1.getAllUsers);
/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: A user object
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Unauthorized, admin access or user account ownership required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', middlewares_1.isAuthenticated, UserController_1.getUser);
/**
 * @openapi
 * /user/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       '200':
 *         description: Updated user object
 *       '400':
 *         description: At least one field is required to update
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: You are not allowed to update this profile
 *       '500':
 *         description: Internal server error
 */
router.patch('/:id', middlewares_1.isAuthenticated, UserController_1.updateUser);
/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       '200':
 *         description: User account deleted successfully
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: You are not allowed to delete this account
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', middlewares_1.isAuthenticated, UserController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=UserRoute.js.map