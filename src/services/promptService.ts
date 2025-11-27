import {db} from '../db/db.js'
import {prompts} from '../db/schema.js'
import {eq} from 'drizzle-orm'

const getPromptForWidgetOrFail = async (widgetId: number) => {
    const [promptRow] = await db
        .select()
        .from(prompts)
        .where(eq(prompts.widgetId, widgetId))

    if (!promptRow) {
        throw new Error(`Prompt missing for widget id: ${widgetId}`)
    }

    return {
        prompt: promptRow.prompt
    }
}

export {getPromptForWidgetOrFail}
