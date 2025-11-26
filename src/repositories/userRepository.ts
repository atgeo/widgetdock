import {db} from '../db/db.js'
import {users} from '../db/schema.js'
import {eq} from 'drizzle-orm'

export async function getUserById(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId))
    return user || null
}
