import {getWidgetById, setWidgetEnabled} from '../repositories/widgetRepository.js'

const toggleWidget = async (id: number, enable: boolean) => {
    const widget = await getWidgetById(id)
    if (!widget) throw new Error('Widget not found')

    await setWidgetEnabled(id, enable)

    return {success: true, message: `Widget ${enable ? 'enabled' : 'disabled'} successfully`}
}

export {toggleWidget}
