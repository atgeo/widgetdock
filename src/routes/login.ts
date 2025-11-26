import express from 'express'
import type {Request, Response} from 'express'

const router = express.Router()

/**
 * @openapi
 * /login:
 *   get:
 *     summary: Render login page
 *     tags:
 *       - Auth
 *     description: Serves the login HTML page to the user.
 *     responses:
 *       200:
 *         description: Login page rendered successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT token to use for protected routes
 *                   example: <!DOCTYPE html><html><body><h1>Login</h1></body></html>
 */
router.get('/login', (_req: Request, res: Response) => {
    res.render('login')
})

export default router
