import express, { Router } from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../Controllers/UserController.js';

const router: Router = express.Router();

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
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', getUser);

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
 *       - in: body
 *         name: user
 *         required: true
 *         description: The user object to update
 *         schema:
 *           type: object
 *           properties:
 *             currentUserId:
 *               type: string
 *             currentUserAdminStatus:
 *               type: boolean
 *           required:
 *             - currentUserId
 *             - currentUserAdminStatus
 *     responses:
 *       '200':
 *         description: Updated user object
 *       '403':
 *         description: Forbidden - user not allowed to update this profile
 *       '500':
 *         description: Internal server error
 */
router.patch('/:id', updateUser);

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
 *       '403':
 *         description: Forbidden - user not allowed to delete this account
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', deleteUser);

/**
 * @openapi
 * /user/:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: An array of user objects
 *       '500':
 *         description: Internal server error
 */
router.get('/', getAllUsers);

export default router;