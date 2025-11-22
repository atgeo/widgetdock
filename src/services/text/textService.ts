import {db} from '../../db/db.js'
import {widgets, widgetTexts} from '../../db/schema.js'
import {and, eq} from 'drizzle-orm'
import {getPromptForWidgetOrFail} from "../promptService.js";
import {generateText} from "../openai/openaiService.js";

export async function getTextForWidget(widgetName: string) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(and(eq(widgets.name, widgetName), eq(widgets.type, 'text')))

    if (!widget) {
        throw new Error(`Widget not found: ${widgetName}`)
    }

    const [widgetText] = await db
        .select()
        .from(widgetTexts)
        .where(eq(widgetTexts.widgetId, widget.id))

    if (widgetText)
        return widgetText.content

    const {prompt} = await getPromptForWidgetOrFail(widgetName, 'text')

    const content = await generateText(prompt)

    await db
        .insert(widgetTexts)
        .values({
            widgetId: widget.id,
            content,
        })

    return content
}
