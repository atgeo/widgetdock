import {db} from '../db/db.js'
import {widgets} from '../db/schema.js'
import {eq} from 'drizzle-orm'

export async function getWidgetBySlug(slug: string) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(eq(widgets.slug, slug))
        .limit(1)

    return widget ?? null
}
