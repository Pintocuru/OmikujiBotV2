// src/configMaker/dev/services/generatorApi.ts
import { BaseApiClient } from './baseApiClient'

/**
 * Generator関連のAPI
 */
class GeneratorApiService extends BaseApiClient {
  /**
   * Generatorファイルを読み込み（存在しない場合は null を返す）
   */
  async loadGeneratorConfig(id?: string): Promise<any | null> {
    try {
      const fileName = this.getGeneratorFileName(id)
      const response = await this.get('load-generator', { fileName })

      if (response.code === 404) return null

      this.validateResponse(response, '設定の読み込みに失敗しました')

      return response.data
    } catch (err: any) {
      if (err?.response?.status === 404) return null
      throw err
    }
  }

  /**
   * ジェネレーター用設定を保存
   */
  async saveGeneratorConfig(data: string): Promise<any> {
    const fileName = this.getGeneratorFileName()

    const response = await this.post('save-generator', { data, fileName })
    this.validateResponse(response, 'ジェネレーター設定の保存に失敗しました')
    return response.data
  }

  /**
   * meta.id からユニークなファイル名を生成する
   */
  private getGeneratorFileName(id?: string): string | null {
    const finalId = id ?? window.omikujiData?.meta.id
    return finalId && finalId.trim() !== '' ? `${finalId}.json` : null
  }
}

export const generatorApi = new GeneratorApiService()
