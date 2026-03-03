// src/MainGenerator/stores/createAppServices.ts
import { CooldownManager } from './CooldownManager/CooldownManager'
import { UserManager } from './UserManager/UserManager'
import { GameScriptManager } from './GameScript/GameScriptManager'
import { MetaStateService } from './MetaState/MetaStateService'
import { PlaceholderVariable } from './PlaceholderVariable/PlaceholderVariable'

export function createAppServices() {
  // 管理オブジェクト
  const cooldownManager = CooldownManager.getInstance()
  const userSession = new UserManager()
  const scriptManager = GameScriptManager.getInstance()
  const metaState = MetaStateService.getInstance()
  const placeholderVariable = new PlaceholderVariable()

  // visitManagerをscriptManagerに注入
  scriptManager.setVisitManager(userSession)

  return {
    userSession,
    cooldownManager,
    scriptManager,
    metaState,
    placeholderVariable,
  }
}
