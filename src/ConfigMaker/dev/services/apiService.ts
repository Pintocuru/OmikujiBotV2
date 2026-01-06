// src/configMaker/dev/services/apiService.ts
import axios, { AxiosInstance, AxiosError } from 'axios'
import { isDev, SERVER_EXPRESS_URL, SERVER_PLUGIN_URL } from '@/types'
import type { FileItem } from '../devTypes'

// ============================================================================
// 型定義
// ============================================================================

interface NormalizedResponse<T> {
  code: number
  data: T
}

type ApiAction = 'health' | 'list' | 'save' | 'load' | 'load-generator' | 'delete' | 'save-omikuji' | 'save-generator'

// ============================================================================
// ユーティリティ関数
// ============================================================================

/**
 * APIレスポンスを正規化
 */
function normalizeApiResponse<T>(raw: any): NormalizedResponse<T> {
  if (raw && typeof raw === 'object' && 'code' in raw && 'response' in raw) {
    return {
      code: raw.code,
      data: JSON.parse(raw.response) as T,
    }
  }
  throw new Error('APIレスポンス形式が不正です')
}

/**
 * ファイル名に .json 拡張子を確実に付与
 */
function ensureJsonExtension(fileName: string): string {
  return fileName.endsWith('.json') ? fileName : `${fileName}.json`
}

/**
 * エラーメッセージマップ
 */
const ERROR_MESSAGES: Record<string, string> = {
  list: 'ファイル一覧の取得に失敗しました',
  'save-omikuji': 'おみくじデータの保存に失敗しました',
  'save-generator': 'ジェネレーター設定の保存に失敗しました',
  save: '設定の保存に失敗しました',
  load: '設定の読み込みに失敗しました',
  'load-generator': '設定の読み込みに失敗しました',
  delete: '設定ファイルの削除に失敗しました',
}

/**
 * URLからエラーメッセージを取得
 */
function getErrorMessage(url: string, status: number): string {
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (url.includes(key)) {
      return `${message} (${status})`
    }
  }
  return `APIリクエストに失敗しました (${status})`
}

// ============================================================================
// メインクラス
// ============================================================================

export class DevConfigApiService {
  private client: AxiosInstance
  private isExpressMode: boolean

  constructor() {
    this.isExpressMode = isDev
    this.client = this.createClient()
  }

  // --------------------------------------------------------------------------
  // プライベートメソッド
  // --------------------------------------------------------------------------

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
          throw new Error(getErrorMessage(url, status))
        }

        if (error.request) {
          throw new Error('サーバーに接続できませんでした')
        }

        throw new Error(`リクエストエラー: ${error.message}`)
      }
    )
  }

  /**
   * GET リクエストの共通処理
   */
  private async get<T>(action: ApiAction, additionalParams: Record<string, any> = {}): Promise<NormalizedResponse<T>> {
    const { data } = await this.client.get('', {
      params: { action, ...additionalParams },
    })
    return normalizeApiResponse<T>(data)
  }

  /**
   * POST リクエストの共通処理
   */
  private async post<T>(action: ApiAction, body: Record<string, any>): Promise<NormalizedResponse<T>> {
    const { data } = await this.client.post('', { action, ...body }, { params: { action } })
    return normalizeApiResponse<T>(data)
  }

  /**
   * レスポンスコードをチェック
   */
  private validateResponse(response: NormalizedResponse<any>, errorMessage: string): void {
    if (response.code !== 200) {
      throw new Error(`${errorMessage} (code: ${response.code})`)
    }
  }

  // --------------------------------------------------------------------------
  // パブリックメソッド
  // --------------------------------------------------------------------------

  /**
   * ヘルスチェック
   */
  async getHealth(): Promise<boolean> {
    const response = await this.get<any>('health')
    return response.code === 200
  }

  /**
   * APIモードを切り替え（Express ⇔ わんコメプラグイン）
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
    const response = await this.get<any[]>('list')

    return response.data.map((file) => ({
      name: file.name,
      displayName: file.name.replace('.json', ''),
      modified: file.modified,
    }))
  }

  /**
   * 設定ファイルを保存
   */
  async saveConfig(fileName: string, configData: string): Promise<string> {
    const finalFileName = ensureJsonExtension(fileName)

    const response = await this.post('save', {
      fileName: finalFileName,
      data: configData,
    })

    this.validateResponse(response, '設定の保存に失敗しました')

    return finalFileName
  }

  /**
   * 設定ファイルをロード
   */
  async loadConfig(fileName: string): Promise<any> {
    try {
      const response = await this.get('load', { fileName })

      this.validateResponse(response, '設定の読み込みに失敗しました')

      return response.data
    } catch (err: any) {
      if (err.response?.status === 404) {
        throw new Error('設定ファイルが見つかりませんでした (404)')
      }
      throw new Error('設定の読み込み中に通信エラーが発生しました')
    }
  }

  /**
   * Generatorファイルを読み込み（存在しない場合は null を返す）
   */
  async loadGeneratorConfig(): Promise<any | null> {
    try {
      const response = await this.get('load-generator')

      if (response.code === 404) {
        return null
      }

      this.validateResponse(response, '設定の読み込みに失敗しました')

      return response.data
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * 設定ファイルを削除
   */
  async deleteConfig(fileName: string): Promise<void> {
    const response = await this.post('delete', { fileName })
    this.validateResponse(response, '設定ファイルの削除に失敗しました')
  }

  /**
   * おみくじデータを保存
   */
  async saveOmikujiData(configData: string): Promise<any> {
    const response = await this.post('save-omikuji', { configData })
    this.validateResponse(response, 'おみくじデータの保存に失敗しました')
    return response.data
  }

  /**
   * ジェネレーター用設定を保存
   */
  async saveGeneratorConfig(configData: string): Promise<any> {
    const response = await this.post('save-generator', { data: configData })
    this.validateResponse(response, 'ジェネレーター設定の保存に失敗しました')
    return response.data
  }
}

export const devConfigApi = new DevConfigApiService()
