// src/configMaker/dev/services/generatorApi.ts
import { BaseApiClient } from './baseApiClient'

/**
 * Generator関連のAPI
 */
class GeneratorApiService extends BaseApiClient {
  /**
   * Generatorファイルを読み込み（存在しない場合は null を返す）
   */
  async loadGeneratorConfig(): Promise<any | null> {
    try {
      const response = await this.get('load-generator')
      if (response.code === 404) return null

      this.validateResponse(response, '設定の読み込みに失敗しました')

      return response.data
    } catch (error: any) {
      if (error?.response?.status === 404) return null
      throw error
    }
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

export const generatorApi = new GeneratorApiService()
