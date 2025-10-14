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
  // ファイル一覧取得
  app.get('/api/dev-configs/list', handleListFiles)

  // ファイル保存
  app.post('/api/dev-configs/save', handleSaveFile)

  // assets/omikujiData.jsにおみくじデータ保存
  app.post('/api/dev-configs/save-omikuji', handleSaveOmikuji)

  // ファイル読み込み
  app.get('/api/dev-configs/load/:fileName', handleLoadFile)

  // ファイル削除
  app.delete('/api/dev-configs/delete/:fileName', handleDeleteFile)

  // ヘルスチェック
  app.get('/api/dev-configs/health', handleHealthCheck)
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
