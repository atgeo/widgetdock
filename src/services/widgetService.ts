import {getWidgetById, setWidgetEnabled} from '../repositories/widgetRepository.js'

export async function toggleWidget(id: number, enable: boolean) {
    const widget = await getWidgetById(id)
    if (!widget) throw new Error('Widget not found')

    await setWidgetEnabled(id, enable)

    return {success: true, message: `Widget ${enable ? 'enabled' : 'disabled'} successfully`}
}
