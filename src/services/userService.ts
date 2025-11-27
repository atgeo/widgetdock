import {db} from '../db/db.js'
import {permissions, rolePermissions, roles, userRoles, users} from '../db/schema.js'
import {eq} from 'drizzle-orm'
import bcrypt from 'bcrypt'

interface CreateUserInput {
    username: string
    password: string
    roleId: number
}

const getUserWithPermissions = async (userId: number) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId))
    if (!user) return null

    const roleRows = await db
        .select({roleName: roles.name})
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, userId))

    const permissions = await getUserPermissions(userId)

    return {
        ...user,
        roles: roleRows.map(r => r.roleName),
        permissions: Array.from(permissions),
    }
}

const getUserPermissions = async (userId: number) => {
    const rows = await db
        .select({
            permissionName: permissions.name,
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(userRoles.userId, userId))

    return new Set(rows.map(r => r.permissionName))
}

const createUser = async ({username, password, roleId}: CreateUserInput) => {
    const existingUser = await db.select().from(users).where(eq(users.username, username))
    if (existingUser.length > 0) {
        throw new Error('User already exists')
    }

    const existingRole = await db.select().from(roles).where(eq(roles.id, roleId))
    if (existingRole.length === 0) {
        throw new Error('Invalid roleId')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [user] = await db.insert(users).values({
        username,
        password: hashedPassword
    }).returning()

    if (!user) {
        throw new Error('Failed to create user')
    }

    await db.insert(userRoles).values({
        userId: user.id,
        roleId: roleId,
    })

    return user
}

export {getUserWithPermissions, getUserPermissions, createUser}
