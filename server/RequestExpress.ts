// server\RequestExpress.ts
import { Response, Application } from 'express'
import * as handlers from './handlers/commonRequests'

// ルート設定
export function setupRoutes(app: Application): void {
  app.get('/api', async (req, res) => {
    const action = req.query.action

    switch (action) {
      case 'list':
        return sendHandlerResult(res, handlers.listFilesHandler)

      case 'load': {
        const fileName = req.query.fileName as string
        return sendHandlerResult(res, () => handlers.loadFileHandler(fileName))
      }

      case 'load-generator':
        return sendHandlerResult(res, () => handlers.loadFileHandler('generator.json', true))

      case 'health':
        return sendHandlerResult(res, handlers.healthCheckHandler)

      default:
        return res.status(400).json({ error: 'Unknown action' })
    }
  })

  app.post('/api', async (req, res) => {
    // わんコメプラグイン仕様に合わせて params.action を必須とする
    const action = req.query.action

    if (!action) {
      return res.status(400).json({ error: 'action parameter is required' })
    }

    switch (action) {
      case 'save': {
        const { fileName, data } = req.body
        return sendHandlerResult(res, () => handlers.saveFileHandler(fileName, data))
      }

      case 'save-generator': {
        const { data } = req.body
        return sendHandlerResult(res, () => handlers.saveFileHandler('generator.json', data, true))
      }

      case 'save-omikuji': {
        const { configData } = req.body
        return sendHandlerResult(res, () => handlers.saveOmikujiHandler(configData, true))
      }

      case 'delete': {
        const { fileName } = req.body
        return sendHandlerResult(res, () => handlers.deleteFileHandler(fileName))
      }

      default:
        return res.status(404).json({ error: `Unknown action: ${action}` })
    }
  })
}

// ヘルパー関数
async function sendHandlerResult(res: Response, handlerFn: () => Promise<{ code: number; data: any }>): Promise<void> {
  const result = await handlerFn()

  res.status(200).json({
    code: result.code,
    response: JSON.stringify(result.data),
  })
}
