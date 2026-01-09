// server/adapters/expressAdapter.ts
import { Request, Response, Application } from 'express'
import { routeRequest, UnifiedRequest } from '../core/router'

/**
 * Expressルートのセットアップ
 */
export function setupExpressRoutes(app: Application): void {
  // GET リクエスト
  app.get('/api', async (req, res) => {
    try {
      const unifiedReq = adaptExpressRequest(req)
      const result = await routeRequest(unifiedReq, true)
      sendUnifiedResponse(res, result)
    } catch (error) {
      console.error('Express GET error:', error)
      res.status(500).json({
        code: 500,
        response: JSON.stringify({ error: 'Internal server error' }),
      })
    }
  })

  // POST リクエスト
  app.post('/api', async (req, res) => {
    try {
      const unifiedReq = adaptExpressRequest(req)
      const result = await routeRequest(unifiedReq, true)
      sendUnifiedResponse(res, result)
    } catch (error) {
      console.error('Express POST error:', error)
      res.status(500).json({
        code: 500,
        response: JSON.stringify({ error: 'Internal server error' }),
      })
    }
  })
}

/**
 * ExpressリクエストをUnifiedRequest形式に変換
 */
function adaptExpressRequest(req: Request): UnifiedRequest {
  return {
    method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    action: (req.query.action as string) || '',
    params: req.query as Record<string, string>,
    body: req.body || {},
  }
}

/**
 * UnifiedResponseをExpressレスポンスとして送信
 */
function sendUnifiedResponse(res: Response, result: { code: number; data: any }): void {
  // わんコメプラグイン仕様に合わせた形式で返す
  res.status(200).json({
    code: result.code,
    response: JSON.stringify(result.data),
  })
}
