import {db} from '../db/db.js'
import {users} from '../db/schema.js'
import {eq} from 'drizzle-orm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function loginUser(username: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username))
    if (!user) throw new Error('Invalid credentials')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid credentials')

    const accessSecret = process.env.JWT_ACCESS_SECRET
    if (!accessSecret) {
        throw new Error('JWT access secret not set');
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET
    if (!refreshSecret) {
        throw new Error('JWT refresh secret not set');
    }

    const accessToken = jwt.sign({userId: user.id, role: user.role}, accessSecret, {expiresIn: '15m'})
    const refreshToken = jwt.sign({userId: user.id}, refreshSecret, {expiresIn: '7d'})

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
        },
    }
}
