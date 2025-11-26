import {db} from '../db/db.js'
import {permissions, rolePermissions, roles, userRoles, users} from '../db/schema.js'
import {eq} from 'drizzle-orm'

export async function getUserWithPermissions(userId: number) {
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

async function getUserPermissions(userId: number) {
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
