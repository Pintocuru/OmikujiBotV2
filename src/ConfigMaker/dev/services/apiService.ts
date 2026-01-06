// src/configMaker/dev/services/apiService.ts
import axios, { AxiosInstance } from 'axios'
import { isDev, SERVER_EXPRESS_URL, SERVER_PLUGIN_URL } from '@/types'
import type { FileItem } from '../devTypes'
import { PluginResponse } from '@onecomme.com/onesdk/types/Plugin'

// ちゃんと正しい型で返っているか
function normalizeApiResponse<T>(raw: any): { code: number; data: T } {
  if (raw && typeof raw === 'object' && 'code' in raw && 'response' in raw) {
    return {
      code: raw.code,
      data: JSON.parse(raw.response) as T,
    }
  }

  throw new Error('APIレスポンス形式が不正です')
}

/**
 * レスポンスがわんコメ形式かどうかを判定
 */
function isPluginResponse(data: any): data is PluginResponse {
  return data && typeof data === 'object' && 'code' in data && 'response' in data
}

/**
 * APIレスポンスを統一形式にパース
 * わんコメ形式の場合はresponseをパースし、Express形式の場合はそのまま返す
 */
function parseApiResponse<T>(data: any): T {
  if (isPluginResponse(data)) {
    return JSON.parse(data.response)
  }
  return data
}

/**
 * わんコメ形式のレスポンスコードをチェック
 */
function validatePluginResponse(data: any, errorMessage: string): void {
  if (isPluginResponse(data) && data.code !== 200) {
    throw new Error(`${errorMessage} (code: ${data.code})`)
  }
}

export class DevConfigApiService {
  private client: AxiosInstance
  private isExpressMode: boolean

  constructor() {
    this.isExpressMode = isDev
    this.client = this.createClient()
  }

  /**
   * Axiosクライアントを作成
   */
  private createClient(): AxiosInstance {
    const baseURL = this.isExpressMode ? SERVER_EXPRESS_URL : SERVER_PLUGIN_URL

    const client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupErrorInterceptor(client)
    return client
  }

  /**
   * エラーハンドリング用インターセプターの設定
   */
  private setupErrorInterceptor(client: AxiosInstance): void {
    client.interceptors.response.use(
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
      list: 'ファイル一覧の取得に失敗しました',
      'save-omikuji': 'おみくじデータの保存に失敗しました',
      save: '設定の保存に失敗しました',
      load: '設定の読み込みに失敗しました',
      delete: '設定ファイルの削除に失敗しました',
    }

    for (const [key, message] of Object.entries(errorMap)) {
      if (url.includes(key)) {
        return `${message} (${status})`
      }
    }

    return `APIリクエストに失敗しました (${status})`
  }

  /**
   * Ping
   */
  async getHealth(): Promise<boolean> {
    const { data } = await this.client.get('', {
      params: { action: 'health' },
    })

    const normalized = normalizeApiResponse<any>(data)
    return normalized.code === 200
  }

  /**
   * APIモードを切り替え（Express ⇔ わんコメプラグイン）
   * 開発環境でのみ使用可能
   */
  toggleApiMode(): void {
    if (!isDev) return

    this.isExpressMode = !this.isExpressMode
    this.client = this.createClient()

    console.log(`[API Mode] ${this.isExpressMode ? 'Express' : 'わんコメプラグイン'}に切り替えました`)
  }

  /**
   * ファイル一覧を取得
   */
  async getFileList(): Promise<FileItem[]> {
    const { data } = await this.client.get('', {
      params: { action: 'list' },
    })

    const normalized = normalizeApiResponse<any[]>(data)

    return normalized.data.map((file) => ({
      name: file.name,
      displayName: file.name.replace('.json', ''),
      modified: file.modified,
    }))
  }

  /**
   * 設定ファイルを保存
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
        params: { action: 'save' },
      }
    )

    const normalized = normalizeApiResponse<any>(data)

    if (normalized.code !== 200) {
      throw new Error(`設定の保存に失敗しました (code: ${normalized.code})`)
    }
  }

  /**
   * 設定ファイルを読み込み
   */
  async loadConfig(fileName: string): Promise<any> {
    const { data } = await this.client.get('', {
      params: { action: 'load', fileName },
    })

    const normalized = normalizeApiResponse<any>(data)

    if (normalized.code !== 200) {
      throw new Error(`設定の読み込みに失敗しました (code: ${normalized.code})`)
    }

    return normalized.data
  }

  /**
   * 設定ファイルを削除
   */
  async deleteConfig(fileName: string): Promise<void> {
    const { data } = await this.client.post(
      '',
      {
        action: 'delete',
        fileName,
      },
      {
        params: { action: 'delete' },
      }
    )

    const normalized = normalizeApiResponse<any>(data)

    if (normalized.code !== 200) {
      throw new Error(`設定ファイルの削除に失敗しました (code: ${normalized.code})`)
    }
  }

  /**
   * おみくじデータを保存
   */
  async saveOmikujiData(configData: string): Promise<any> {
    const { data } = await this.client.post(
      '',
      {
        action: 'save-omikuji',
        configData,
      },
      {
        params: { action: 'save-omikuji' },
      }
    )

    const normalized = normalizeApiResponse<any>(data)

    if (normalized.code !== 200) {
      throw new Error(`おみくじデータの保存に失敗しました (code: ${normalized.code})`)
    }

    return normalized.data
  }

  /**
   * ジェネレーター用設定を保存
   */
  async saveGeneratorConfig(configData: string): Promise<any> {
    const { data } = await this.client.post(
      '',
      {
        action: 'save-generator',
        data: configData,
      },
      {
        params: { action: 'save-generator' },
      }
    )

    const normalized = normalizeApiResponse<any>(data)

    if (normalized.code !== 200) {
      throw new Error(`ジェネレーター設定の保存に失敗しました (code: ${normalized.code})`)
    }

    return normalized.data
  }
}

export const devConfigApi = new DevConfigApiService()
