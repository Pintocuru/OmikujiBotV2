// src/configMaker/dev/services/apiService.ts
import axios, { AxiosInstance } from 'axios'
import type { FileItem } from '../devTypes'
import { isDev, SERVER_EXPRESS_URL, SERVER_PLUGIN_URL } from '@/types'

/**
 * APIレスポンスの型定義
 */
interface WankommeResponse {
  code: number
  response: string // JSON文字列
}

/**
 * レスポンスがわんコメ形式かどうかを判定
 */
function isWankommeResponse(data: any): data is WankommeResponse {
  return data && typeof data === 'object' && 'code' in data && 'response' in data && typeof data.response === 'string'
}

/**
 * APIレスポンスを統一形式にパース
 * わんコメ形式の場合はresponseをパースし、Express形式の場合はそのまま返す
 */
function parseApiResponse<T>(data: any): T {
  if (isWankommeResponse(data)) {
    return JSON.parse(data.response)
  }
  return data
}

export class DevConfigApiService {
  private readonly client: AxiosInstance
  private readonly isExpressMode: boolean

  constructor() {
    // 開発環境では自前Expressサーバー、本番環境ではわんコメプラグイン
    this.isExpressMode = isDev
    const baseURL = this.isExpressMode ? SERVER_EXPRESS_URL : SERVER_PLUGIN_URL

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupErrorInterceptor()
  }

  /**
   * エラーハンドリング用インターセプターの設定
   */
  private setupErrorInterceptor(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status
          const url = error.config.url || ''
          const message = this.getErrorMessage(url, status)
          throw new Error(message)
        }

        if (error.request) {
          throw new Error('サーバーに接続できませんでした')
        }

        throw new Error(`リクエストエラー: ${error.message}`)
      }
    )
  }

  /**
   * URLとステータスコードからエラーメッセージを生成
   */
  private getErrorMessage(url: string, status: number): string {
    const errorMap: Record<string, string> = {
      '/list': 'ファイル一覧の取得に失敗しました',
      '/save-omikuji': 'おみくじデータの保存に失敗しました',
      '/save': '設定の保存に失敗しました',
      '/load': '設定の読み込みに失敗しました',
      '/delete': '設定ファイルの削除に失敗しました',
    }

    for (const [key, message] of Object.entries(errorMap)) {
      if (url.includes(key)) {
        return `${message} (${status})`
      }
    }

    return `APIリクエストに失敗しました (${status})`
  }

  /**
   * ファイル一覧を取得
   * Express形式: GET /list → 配列 [{ name, modified }, ...]
   * わんコメ形式: GET ?action=list → { code: 200, response: "[...]" }
   */
  async getFileList(): Promise<FileItem[]> {
    if (this.isExpressMode) {
      // Express形式
      const { data } = await this.client.get('', {
        params: { action: 'list' },
      })
      return data.map((file: any) => ({
        name: file.name,
        displayName: file.name.replace('.json', ''),
        modified: file.modified,
      }))
    } else {
      // わんコメ形式
      const { data } = await this.client.get('', {
        params: { action: 'list' },
      })
      const parsed = parseApiResponse<any[]>(data)
      return Array.isArray(parsed)
        ? parsed.map((file: any) => ({
            name: file.name,
            displayName: file.name.replace('.json', ''),
            modified: file.modified,
          }))
        : []
    }
  }

  /**
   * 設定ファイルを保存
   * Express形式: POST /save { fileName, data }
   * わんコメ形式: POST /save { fileName, data } → { code: 200, response: "..." }
   */
  async saveConfig(fileName: string, configData: string): Promise<void> {
    const finalFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`

    const { data } = await this.client.post(
      '',
      {
        action: 'save',
        fileName: finalFileName,
        data: configData,
      },
      {
        params: { action: 'save' }, // ← これが必須
      }
    )

    if (!this.isExpressMode && data.code !== 200) {
      throw new Error(`設定の保存に失敗しました (code: ${data.code})`)
    }
  }

  /**
   * 設定ファイルを読み込み
   * Express形式: GET /load/:fileName → JSONオブジェクト
   * わんコメ形式: GET /load/:fileName → { code: 200, response: "{...}" }
   */
  async loadConfig(fileName: string): Promise<any> {
    const { data } = await this.client.get('', {
      params: { action: 'load', fileName },
    })

    return parseApiResponse(data)
  }

  /**
   * 設定ファイルを削除
   * Express形式: DELETE /delete/:fileName
   * わんコメ形式: DELETE /delete/:fileName → { code: 200, response: "..." }
   */
  async deleteConfig(fileName: string): Promise<void> {
    const { data } = await this.client.post(
      '',
      {
        action: 'delete',
        fileName,
      },
      {
        params: { action: 'delete' }, // ← これが必須
      }
    )

    if (!this.isExpressMode && data.code !== 200) {
      throw new Error(`設定ファイルの削除に失敗しました (code: ${data.code})`)
    }
  }

  /**
   * おみくじデータを保存
   * Express形式: POST /save-omikuji { configData } → レスポンス
   * わんコメ形式: POST /save-omikuji { configData } → { code: 200, response: "..." }
   */
  async saveOmikujiData(configData: string): Promise<any> {
    const { data } = await this.client.post(
      '',
      {
        action: 'save-omikuji',
        configData,
      },
      {
        params: { action: 'save-omikuji' }, // ← これが必須
      }
    )

    if (!this.isExpressMode && data.code !== 200) {
      throw new Error(`おみくじデータの保存に失敗しました (code: ${data.code})`)
    }

    return parseApiResponse(data)
  }
}

export const devConfigApi = new DevConfigApiService()
