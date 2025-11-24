import {db} from '../../db/db.js'
import {widgets, widgetTexts} from '../../db/schema.js'
import {and, eq} from 'drizzle-orm'
import {getPromptForWidgetOrFail} from '../promptService.js'
import {generateText} from '../openai/openaiService.js'

export async function generateWidgetText(widgetId: number) {
    const [widget] = await db.select().from(widgets).where(eq(widgets.id, widgetId))
    if (!widget) throw new Error(`Widget not found: ${widgetId}`)

    const {prompt} = await getPromptForWidgetOrFail(widget.id)

    const content = await generateText(prompt)

    await db
        .insert(widgetTexts)
        .values({
            widgetId: widget.id,
            content,
        })
        .onConflictDoUpdate({
            target: widgetTexts.widgetId,
            set: {
                content,
                updatedAt: new Date(),
            },
        })
}

export async function getTextForWidget(widgetId: number) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(and(eq(widgets.id, widgetId), eq(widgets.type, 'text')))

    if (!widget) {
        throw new Error(`Widget not found: ${widgetId}`)
    }

    const [widgetText] = await db
        .select()
        .from(widgetTexts)
        .where(eq(widgetTexts.widgetId, widget.id))

    if (!widgetText) {
        throw new Error(`Widget text not found for widget: ${widget.name}`)
    }

    const text = widgetText.content

    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n+/g, '\n\n')

    const paragraphs = html
        .split(/\n\n/)
        .map(p => `<p>${p}</p>`)

    return paragraphs.join('\n')
}
