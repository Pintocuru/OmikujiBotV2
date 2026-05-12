// src/PresetManager/services/baseApiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios'
import { isDev, SERVER_EXPRESS_URL, SERVER_PLUGIN_URL } from '@/types'
import { getErrorMessage, normalizeApiResponse, NormalizedResponse } from './apiServiceUtils'

export class ConnectionError extends Error {
  constructor() {
    super('サーバーに接続できませんでした')
    this.name = 'ConnectionError'
  }
}

/**
 * API通信の基盤クラス
 * 各ドメインAPIクラスはこれを継承して実装する
 */
export abstract class BaseApiClient {
  protected client: AxiosInstance
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
      headers: { 'Content-Type': 'application/json' },
    })

    this.setupErrorInterceptor(client)
    return client
  }

  /**
   * エラーハンドリング用インターセプター
   */
  private setupErrorInterceptor(client: AxiosInstance): void {
    client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status
          const url = error.config?.url || ''

          // 400/404はプラグインなしの想定内 → ConnectionErrorとして返す
          if (status === 400 || status === 404) {
            throw new ConnectionError()
          }

          throw new Error(getErrorMessage(url, status))
        }

        if (error.request) {
          throw new ConnectionError()
        }

        throw new Error(`リクエストエラー: ${error.message}`)
      }
    )
  }

  /**
   * GET リクエストの共通処理
   */
  protected async get<T>(action: string, additionalParams: Record<string, any> = {}): Promise<NormalizedResponse<T>> {
    const { data } = await this.client.get('', { params: { action, ...additionalParams } })
    return normalizeApiResponse<T>(data)
  }

  /**
   * POST リクエストの共通処理
   */
  protected async post<T>(action: string, body: Record<string, any>): Promise<NormalizedResponse<T>> {
    // ? わんコメの仕様?により、bodyのほうにparamsを入れる必要がある…？設定ミスかも
    const { data } = await this.client.post('', { action, ...body }, { params: { action } })
    return normalizeApiResponse<T>(data)
  }

  /**
   * レスポンスコードをチェック
   */
  protected validateResponse(response: NormalizedResponse<any>, errorMessage: string): void {
    if (response.code !== 200) {
      throw new Error(`${errorMessage} (code: ${response.code})`)
    }
  }

  /**
   * APIモードを切り替え（Express ⇔ わんコメプラグイン）
   */
  toggleApiMode(): boolean {
    if (!isDev) return this.isExpressMode

    this.isExpressMode = !this.isExpressMode
    this.client = this.createClient()

    console.log(`[API Mode] ${this.isExpressMode ? 'Express' : 'わんコメプラグイン'}に切り替えました`)
    return this.isExpressMode
  }

  /**
   * ヘルスチェック
   */
  async getHealth(): Promise<boolean> {
    try {
      const response = await this.get<any>('health')
      return response.code === 200
    } catch {
      return false
    }
  }
}
