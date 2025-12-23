// src/MainGenerator/script/PostMessage/ServiceManager.ts
import { CharacterType } from '@/types/'
import { ServiceAPI } from '@shared/sdk/service/ServiceAPI'
import { Service } from '../../../../../../libs/onesdk/types/Service'

/**
 * サービス管理を担当するクラス
 */
export class ServiceManager {
  private services: Service[] = []
  private createdServiceIds: Set<string> = new Set()

  constructor(private readonly serviceAPI: ServiceAPI) {}

  /**
   * サービス一覧を更新
   */
  updateServices(services: Service[]): void {
    this.services = services
  }

  /**
   * キャラクターに対応するサービスが存在することを保証
   */
  async ensureServiceExists(chara: CharacterType): Promise<void> {
    if (!chara.frameId) return

    const serviceExists = this.isServiceExists(chara.frameId)
    if (!serviceExists) {
      await this.createService(chara)
    }
  }

  private isServiceExists(frameId: string): boolean {
    return this.services.some((s) => s.id === frameId) || this.createdServiceIds.has(frameId)
  }

  private async createService(chara: CharacterType): Promise<void> {
    if (!chara.frameId) return

    try {
      const newService = await this.serviceAPI.createService(chara.name, chara.frameId, chara.color.backgroundColor)

      if (newService) {
        this.createdServiceIds.add(chara.frameId)
        // サービス作成後にサービス一覧を再取得して更新
        const updatedServices = await this.serviceAPI.getServices()
        this.services = updatedServices ?? []
      }
    } catch (error) {
      console.error(`枠作成に失敗: ${chara.name} (${chara.frameId})`, error)
      throw error
    }
  }
}
