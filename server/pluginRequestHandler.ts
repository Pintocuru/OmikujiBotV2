// pluginRequestHandler.ts
import { getFileList, saveFile, saveOmikujiData, loadFile, deleteFile } from './fileService'
import { PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'

/**
 * プラグインリクエストのハンドラー
 * req.params.action に基づいて適切な処理を実行
 */
export async function handlePluginRequest(req: PluginRequest): Promise<PluginResponse> {
  try {
    const action = req.params?.action
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})

    // actionがない場合
    if (!action) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'action parameter is required' }),
      }
    }

    // actionに応じた処理を実行
    switch (action) {
      case 'list':
        return await handleListFiles()

      case 'save':
        return await handleSaveFile(body)

      case 'save-omikuji':
        return await handleSaveOmikuji(body)

      case 'load':
        return await handleLoadFile(body, req.params)

      case 'delete':
        return await handleDeleteFile(body, req.params)

      case 'health':
        return handleHealthCheck()

      default:
        return {
          code: 404,
          response: JSON.stringify({ error: `Unknown action: ${action}` }),
        }
    }
  } catch (error) {
    console.error('Plugin request error:', error)
    return {
      code: 500,
      response: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

/**
 * ファイル一覧取得
 * GET ?action=list
 */
async function handleListFiles(): Promise<PluginResponse> {
  try {
    const files = await getFileList()
    return {
      code: 200,
      response: JSON.stringify(files),
    }
  } catch (error) {
    console.error('List files error:', error)
    return {
      code: 500,
      response: JSON.stringify({ error: 'Failed to list files' }),
    }
  }
}

/**
 * ファイル保存
 * POST ?action=save
 * body: { fileName: string, data: string }
 */
async function handleSaveFile(body: any): Promise<PluginResponse> {
  try {
    const { fileName, data } = body

    if (!fileName || !data) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'fileName and data are required' }),
      }
    }

    // ファイル名の検証
    if (!/^[\w\-. ]+\.json$/.test(fileName)) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'Invalid file name' }),
      }
    }

    await saveFile(fileName, data)
    console.info(`💾 Saved config file: ${fileName}`)

    return {
      code: 200,
      response: JSON.stringify({ message: 'File saved successfully', fileName }),
    }
  } catch (error) {
    console.error('Save file error:', error)
    return {
      code: 500,
      response: JSON.stringify({ error: 'Failed to save file' }),
    }
  }
}

/**
 * おみくじデータ保存
 * POST ?action=save-omikuji
 * body: { configData: string }
 */
async function handleSaveOmikuji(body: any): Promise<PluginResponse> {
  try {
    const { configData } = body

    if (!configData) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'configData is required' }),
      }
    }

    await saveOmikujiData(configData)
    console.info('🎋 Saved omikuji data to assets/omikujiData.js')

    return {
      code: 200,
      response: JSON.stringify({
        message: 'Omikuji data saved successfully',
        filePath: 'assets/omikujiData.js',
      }),
    }
  } catch (error) {
    console.error('Save omikuji error:', error)
    return {
      code: 500,
      response: JSON.stringify({ error: 'Failed to save omikuji data' }),
    }
  }
}

/**
 * ファイル読み込み
 * GET ?action=load&fileName=xxx
 * または POST ?action=load body: { fileName: string }
 */
async function handleLoadFile(body: any, params: Record<string, string>): Promise<PluginResponse> {
  try {
    // fileNameはparamsまたはbodyから取得
    const fileName = params.fileName || body.fileName

    if (!fileName) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'fileName is required' }),
      }
    }

    // ファイル名の検証
    if (!/^[\w\-. ]+\.json$/.test(fileName)) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'Invalid file name' }),
      }
    }

    const data = await loadFile(fileName)
    console.info(`📖 Loaded config file: ${fileName}`)

    return {
      code: 200,
      response: JSON.stringify(data),
    }
  } catch (error: any) {
    console.error('Load file error:', error)
    if (error.code === 'ENOENT') {
      return {
        code: 404,
        response: JSON.stringify({ error: 'File not found' }),
      }
    }
    return {
      code: 500,
      response: JSON.stringify({ error: 'Failed to load file' }),
    }
  }
}

/**
 * ファイル削除
 * DELETE ?action=delete&fileName=xxx
 * または POST ?action=delete body: { fileName: string }
 */
async function handleDeleteFile(body: any, params: Record<string, string>): Promise<PluginResponse> {
  try {
    // fileNameはparamsまたはbodyから取得
    const fileName = params.fileName || body.fileName

    if (!fileName) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'fileName is required' }),
      }
    }

    // ファイル名の検証
    if (!/^[\w\-. ]+\.json$/.test(fileName)) {
      return {
        code: 400,
        response: JSON.stringify({ error: 'Invalid file name' }),
      }
    }

    await deleteFile(fileName)
    console.info(`🗑️ Deleted config file: ${fileName}`)

    return {
      code: 200,
      response: JSON.stringify({ message: 'File deleted successfully', fileName }),
    }
  } catch (error: any) {
    console.error('Delete file error:', error)
    if (error.code === 'ENOENT') {
      return {
        code: 404,
        response: JSON.stringify({ error: 'File not found' }),
      }
    }
    return {
      code: 500,
      response: JSON.stringify({ error: 'Failed to delete file' }),
    }
  }
}

/**
 * ヘルスチェック
 * GET ?action=health
 */
function handleHealthCheck(): PluginResponse {
  return {
    code: 200,
    response: JSON.stringify({ status: 'OK', message: 'Plugin API is running' }),
  }
}
