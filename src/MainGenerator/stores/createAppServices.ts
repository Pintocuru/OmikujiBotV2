// src\MainGenerator\stores\createAppServices.ts
import { CooldownManager } from './CooldownManager/CooldownManager'
import { UserVisitManager } from './UserVisitManager/UserVisitManager'
import { GameScriptManager } from './GameScript/GameScriptManager'
import { MetaStateService } from './MetaState/MetaStateService'

export function createAppServices() {
  // 管理オブジェクト
  const cooldownManager = CooldownManager.getInstance()
  const userVisitManager = new UserVisitManager()
  const scriptManager = GameScriptManager.getInstance()
  const metaState = MetaStateService.getInstance()

  // visitManagerをscriptManagerに注入
  scriptManager.setVisitManager(userVisitManager)

  return {
    userVisitManager,
    cooldownManager,
    scriptManager,
    metaState,
  }
}
