import {db} from '../db/db.js'
import {widgets, prompts} from '../db/schema.js'
import {eq, and} from "drizzle-orm"

export async function getPromptForWidgetOrFail(name: string, type: string) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(
            and(
                eq(widgets.name, name),
                eq(widgets.type, type)
            )
        )

    if (!widget) {
        throw new Error(`Widget not found: ${name} (${type})`)
    }

    const [promptRow] = await db
        .select()
        .from(prompts)
        .where(eq(prompts.widgetId, widget.id))

    if (!promptRow) {
        throw new Error(`Prompt missing for widget: ${name}`)
    }

    return {
        widget,
        prompt: promptRow.prompt
    }
}
