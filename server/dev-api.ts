// server/dev-api.ts
import express, { Request, Response, Application, NextFunction } from 'express'
import cors from 'cors'
import { Server } from 'http'
import { CONFIG_DIR } from './fileService.js'
import {
  handleListFiles,
  handleSaveFile,
  handleSaveOmikuji,
  handleLoadFile,
  handleDeleteFile,
  handleHealthCheck,
} from './routeHandlers.js'

let server: Server | null = null

// ログ用ミドルウェア
function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log(`[DEV API] ${req.method} ${req.path}`)
  next()
}

// ルート設定
function setupRoutes(app: Application): void {
  app.get('/api', async (req, res) => {
    const action = req.query.action

    switch (action) {
      case 'list':
        return handleListFiles(req, res)

      case 'load':
        // fileName を params に詰め替える
        req.params = { fileName: req.query.fileName as string }
        return handleLoadFile(req, res)

      case 'health':
        return handleHealthCheck(req, res)

      default:
        return res.status(400).json({ error: 'Unknown action' })
    }
  })

  app.post('/api', async (req, res) => {
    const action = req.body.action

    switch (action) {
      case 'save':
        return handleSaveFile(req, res)

      case 'save-omikuji':
        return handleSaveOmikuji(req, res)

      case 'delete':
        return handleDeleteFile(req, res)

      default:
        return res.status(404).json({ error: 'Unknown action' })
    }
  })
}

// 開発用APIサーバーを起動
export function startDevApiServer(): Server | null {
  // 既にサーバーが起動している場合はスキップ
  if (server) {
    console.log('⚠️ Dev API server is already running')
    return server
  }

  const app: Application = express()
  const port = 3001

  // ミドルウェア設定
  app.use(cors())
  app.use(express.json({ limit: '10mb' }))
  app.use(logMiddleware)
  // ルート設定
  setupRoutes(app)

  // サーバー起動
  server = app.listen(port, () => {
    console.log(`🚀 Dev API server running on http://localhost:${port}`)
    console.log(`📁 Config files directory: ${CONFIG_DIR}`)
  })

  // プロセス終了時の処理
  process.on('SIGTERM', () => {
    if (server) {
      server.close()
      server = null
    }
  })

  return server
}

// サーバーを停止
export function stopDevApiServer(): void {
  if (server) {
    server.close()
    server = null
    console.log('🛑 Dev API server stopped')
  }
}
