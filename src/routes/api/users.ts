import express from 'express'
import type {Request, Response} from 'express'
import {requirePermission} from '../../middleware/requirePermission.js'
import {checkJwt} from '../../middleware/checkJwt.js'
import {createUser} from '../../services/userService.js'
import {attachUserAuthData} from '../../middleware/attachUserAuthData.js'

const router = express.Router()
router.use(checkJwt)
router.use(attachUserAuthData)

router.post('/', requirePermission('users.create'), async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({message: 'Missing request body'})
        }

        const {username, password, roleId} = req.body

        if (!username || !password || !roleId) {
            return res.status(400).json({message: 'Missing required fields'})
        }

        const user = await createUser({username, password, roleId})

        res.status(201).json({message: 'User created', user})
    } catch (err: any) {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
    }
})

export default router
