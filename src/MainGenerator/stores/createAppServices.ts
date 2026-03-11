// src/MainGenerator/stores/createAppServices.ts
import { CooldownManager } from './CooldownManager/CooldownManager'
import { UserManager } from './UserManager/UserManager'
import { GameScriptManager } from './GameScript/GameScriptManager'
import { MetaStateService } from './MetaState/MetaStateService'
import { PlaceholderVariable } from './PlaceholderVariable/PlaceholderVariable'
import { StreamStatsManager } from './StreamStats/StreamStatsManager'

export function createAppServices() {
  const cooldownManager = CooldownManager.getInstance()
  const userSession = new UserManager()
  const scriptManager = GameScriptManager.getInstance()
  const metaState = MetaStateService.getInstance()
  const streamStats = new StreamStatsManager()
  const placeholderVariable = new PlaceholderVariable()

  scriptManager.setVisitManager(userSession)

  // 配信開始時に各種データリセット
  metaState.subscribe((event) => {
    const prev = event.previous?.isLive ?? false
    const curr = event.current.isLive
    if (!prev && curr) {
      streamStats.reset()
      userSession.resetSession()
    }
  })

  return {
    userSession,
    cooldownManager,
    scriptManager,
    metaState,
    streamStats,
    placeholderVariable,
  }
}
