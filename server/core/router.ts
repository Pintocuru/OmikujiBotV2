// server/core/router.ts

/**
 * 統一されたリクエスト/レスポンス型
 * プラグインとExpressの違いを吸収する
 */
export interface UnifiedRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  action: string
  params: Record<string, string>
  body: Record<string, any>
}

export interface UnifiedResponse {
  code: number
  data: any
}

/**
 * 統合ルーター
 * プラグインとExpressの両方から使用される
 */
import * as configHandler from './handlers/configHandler'
import * as generatorHandler from './handlers/generatorHandler'
import * as omikujiHandler from './handlers/omikujiHandler'

export async function routeRequest(req: UnifiedRequest, isExpress?: boolean): Promise<UnifiedResponse> {
  const { method, action, params, body } = req

  // アクションが必須
  if (!action) {
    return { code: 400, data: { error: 'action parameter is required' } }
  }

  // メソッド別にルーティング
  if (method === 'GET') {
    return handleGetRequest(action, params)
  }

  if (method === 'POST') {
    return handlePostRequest(action, params, body, isExpress)
  }

  return { code: 405, data: { error: `Method ${method} not allowed` } }
}

/**
 * GETリクエストのルーティング
 */
async function handleGetRequest(action: string, params: Record<string, string>): Promise<UnifiedResponse> {
  switch (action) {
    case 'health':
      return { code: 200, data: { status: 'OK', message: 'API is running' } }

    case 'list':
      return configHandler.listFiles()

    case 'load':
      return configHandler.loadConfig(params.fileName)

    case 'load-generator':
      return generatorHandler.loadGeneratorConfig(params.fileName)

    default:
      return { code: 404, data: { error: `Unknown GET action: ${action}` } }
  }
}

/**
 * POSTリクエストのルーティング
 */
async function handlePostRequest(
  action: string,
  params: Record<string, string>,
  body: Record<string, any>,
  isExpress?: boolean
): Promise<UnifiedResponse> {
  switch (action) {
    case 'move':
      return configHandler.moveConfig(body.fromName, body.toName)

    case 'save':
      return configHandler.saveConfig(body.fileName, body.data)

    case 'delete':
      return configHandler.deleteConfig(params.fileName || body.fileName)

    case 'save-generator':
      return generatorHandler.saveGeneratorConfig(body.data, body.fileName)

    case 'save-omikuji':
      return omikujiHandler.saveOmikujiData(body.configData, isExpress)

    default:
      return { code: 404, data: { error: `Unknown POST action: ${action}` } }
  }
}
