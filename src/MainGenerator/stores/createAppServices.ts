// src/MainGenerator/stores/createAppServices.ts
import { CooldownManager } from './CooldownManager/CooldownManager'
import { UserManager } from './UserManager/UserManager'
import { GameScriptManager } from './GameScript/GameScriptManager'
import { ServiceMetaStore } from './MetaState/MetaStateService'
import { PlaceholderVariable } from './PlaceholderVariable/PlaceholderVariable'
import { StreamStatsManager } from './StreamStats/StreamStatsManager'
import { ReactionStatsManager } from './ReactionManager/ReactionStatsManager'

export function createAppServices() {
  const cooldownManager = CooldownManager.getInstance()
  const userSession = new UserManager()
  const scriptManager = GameScriptManager.getInstance()
  const serviceMetaStore = ServiceMetaStore.getInstance()
  const streamStats = StreamStatsManager.getInstance()
  const placeholderVariable = new PlaceholderVariable()
  const reactionStats = new ReactionStatsManager()

  scriptManager.setVisitManager(userSession)

  // 配信開始時に各種データリセット
  serviceMetaStore.subscribe((event) => {
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
    serviceMetaStore,
    streamStats,
    placeholderVariable,
    reactionStats,
  }
}
