// server/adapters/pluginAdapter.ts
import { PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'
import { routeRequest, UnifiedRequest } from '../core/router'

/**
 * わんコメプラグイン用のリクエストハンドラー
 */
export async function pluginRequest(req: PluginRequest): Promise<PluginResponse> {
  try {
    // 統一形式に変換
    const unifiedReq = adaptPluginRequest(req)

    // コアルーターで処理
    const result = await routeRequest(unifiedReq)

    // プラグイン形式のレスポンスに変換
    return {
      code: result.code,
      response: JSON.stringify(result.data),
    }
  } catch (error) {
    console.error('Plugin request error:', error)
    return {
      code: 500,
      response: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

/**
 * プラグインリクエストを統一形式に変換
 */
function adaptPluginRequest(req: PluginRequest): UnifiedRequest {
  // bodyをパース
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})

  return {
    method: req.method,
    action: req.params?.action || '',
    params: req.params || {},
    body,
  }
}
