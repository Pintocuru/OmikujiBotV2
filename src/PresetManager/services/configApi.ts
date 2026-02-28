// src/PresetManager/services/configApi.ts
import { BaseApiClient } from './baseApiClient'
import { ensureJsonExtension } from './apiServiceUtils'
import type { FileItem } from '../devTypes'

/**
 * 設定ファイル関連のAPI
 */
class ConfigApiService extends BaseApiClient {
  /**
   * ファイル一覧を取得
   */
  async getFileList(): Promise<FileItem[]> {
    const response = await this.get<any[]>('list')

    return response.data.map((file) => {
      const name: string = file.name
      const hasFolder = name.includes('/')

      const folder = hasFolder ? name.split('/', 2)[0] : null
      const displayName = hasFolder ? name.split('/', 2)[1].replace('.json', '') : name.replace('.json', '')

      return {
        name,
        folder,
        displayName,
        modified: file.modified,
      }
    })
  }

  /**
   * 設定ファイルを取得
   */
  async loadConfig(fileName: string): Promise<any> {
    const finalFileName = ensureJsonExtension(fileName)
    try {
      const response = await this.get('load', { fileName: finalFileName })
      this.validateResponse(response, '設定の読み込みに失敗しました')

      return response.data
    } catch (err: any) {
      if (!err.response) throw err

      if (err.response.status === 404) {
        throw new Error('設定ファイルが見つかりませんでした (404)')
      }
      throw new Error('設定の読み込み中に通信エラーが発生しました')
    }
  }

  /**
   * ファイル移動
   */
  async moveConfig(fromName: string, toName: string): Promise<boolean> {
    const result = await this.post('move', { fromName, toName })
    return result !== null
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
   * おみくじデータを保存
   */
  async saveOmikujiData(configData: string): Promise<any> {
    const response = await this.post('save-omikuji', { configData })
    this.validateResponse(response, 'おみくじデータの保存に失敗しました')
    return response.data
  }

  /**
   * 設定ファイルを削除
   */
  async deleteConfig(fileName: string): Promise<void> {
    const response = await this.post('delete', { fileName })
    this.validateResponse(response, '設定ファイルの削除に失敗しました')
  }
}

export const configApi = new ConfigApiService()
