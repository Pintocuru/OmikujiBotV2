// server\dev-api.ts
import express, { Request, Response, Application, NextFunction } from 'express'
import cors from 'cors'
import { Server } from 'http'
import { fileURLToPath } from 'url'
import path from 'path'
import { setupExpressRoutes } from './adapters/expressAdapter'

// ディレクトリ設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const CONFIG_DIR = path.join(__dirname, 'omikujiDatas')
export const ASSETS_DIR = path.join(__dirname, '..', 'assets')
export const ROOT_DIR = path.join(__dirname)
const DIR = {
  config: path.join(__dirname, 'omikujiDatas'),
  assets: path.join(__dirname, '..', 'assets'),
  root: path.join(__dirname),
}

let server: Server | null = null

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
  setupExpressRoutes(app)

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

// ログ用ミドルウェア
function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log(`[DEV API] ${req.method} ${req.path}`)
  next()
}
