// server\dev-api.ts
import express, { Request, Response, Application, NextFunction } from 'express'
import cors from 'cors'
import { Server } from 'http'
import { CONFIG_DIR } from './fileService'
import { setupRoutes } from './RequestExpress'

let server: Server | null = null

// ログ用ミドルウェア
function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log(`[DEV API] ${req.method} ${req.path}`)
  next()
}

// 開発用APIサーバーを起動
export function startDevApiServer(): Server | null {
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
