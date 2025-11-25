import express from 'express'
import jwt from 'jsonwebtoken'
import type {Request, Response} from 'express'

const router = express.Router()

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and generate JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: superSecurePassword
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token to use for protected routes
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 */
router.post('/login', (req: Request, res: Response) => {
    const {username, password} = req.body
    if (username === 'admin' && password === 'secret') {
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret)
            throw new Error('JWT_SECRET is not defined')

        const token = jwt.sign(
            {userId: 1, role: 'admin'},
            jwtSecret,
            {expiresIn: '1h'}
        )
        return res.json({token})
    }
    res.status(401).json({error: 'Invalid credentials'})
})

export default router
