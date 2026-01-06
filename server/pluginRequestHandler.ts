// server/pluginRequestHandler.ts（簡潔に）
import { PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'
import * as handlers from './handlers/commonHandlers.js'

export async function handlePluginRequest(req: PluginRequest): Promise<PluginResponse> {
  try {
    const action = req.params?.action
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})

    if (!action) {
      return { code: 400, response: JSON.stringify({ error: 'action parameter is required' }) }
    }

    let result: { code: number; data: any }

    switch (action) {
      case 'list':
        result = await handlers.listFilesHandler()
        break

      case 'save':
        result = await handlers.saveFileHandler(body.fileName, body.data)
        break

      case 'save-omikuji':
        result = await handlers.saveOmikujiHandler(body.configData)
        break

      case 'load':
        result = await handlers.loadFileHandler(req.params.fileName || body.fileName)
        break

      case 'delete':
        result = await handlers.deleteFileHandler(req.params.fileName || body.fileName)
        break

      case 'health':
        result = handlers.healthCheckHandler()
        break

      default:
        result = { code: 404, data: { error: `Unknown action: ${action}` } }
    }

    return { code: result.code, response: JSON.stringify(result.data) }
  } catch (error) {
    console.error('Plugin request error:', error)
    return { code: 500, response: JSON.stringify({ error: 'Internal server error' }) }
  }
}
