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
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only refresh token cookie
 *             example: refreshToken=abc123; HttpOnly; Path=/; Max-Age=2592000;
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
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

    if (username !== 'admin' || password !== 'secret') {
        return res.status(401).json({error: 'Invalid credentials'})
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET
    const refreshSecret = process.env.JWT_REFRESH_SECRET

    if (!accessSecret || !refreshSecret) {
        throw new Error('JWT secrets missing');
    }

    const accessToken = jwt.sign({userId: 1, role: 'admin'}, accessSecret, {expiresIn: '15m'})
    const refreshToken = jwt.sign({userId: 1}, refreshSecret, {expiresIn: '7d'})

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })

    return res.json({accessToken})
})

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: New access token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token to use for protected routes
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No refresh token provided
 */
router.post('/refresh-token', async (req, res) => {
    const token = req.cookies.refreshToken
    if (!token) {
        return res.status(401).json({error: 'No refresh token provided'})
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET
    const refreshSecret = process.env.JWT_REFRESH_SECRET

    if (!accessSecret) throw new Error('JWT_ACCESS_SECRET is not defined')
    if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET is not defined')

    const payload = jwt.verify(token, refreshSecret)

    if (typeof payload !== 'object' || !payload.userId) {
        throw new Error('Invalid refresh token payload')
    }

    const newAccessToken = jwt.sign({userId: payload.userId}, accessSecret, {expiresIn: '15m'})
    res.json({accessToken: newAccessToken})
})

export default router
