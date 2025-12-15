// shared/types/GameComponentSchema.ts
import { DefaultTypes, DisplaySize } from '@shared/types/'
import { UserStatsType } from '../../common/GameScripts/scriptsEngine/LogRank/GameScriptSchema'
import { GameComponentConfig } from './GameRankingTypes'

export interface GameStatistics {
  averageScore: number
  totalScore: number
  totalCount: number
}

// props型定義付き
export type ScriptComponentPropsType = {
  componentKey: string // Vueレンダリング用
  componentConfig: GameComponentConfig | null
  settings: DefaultTypes
  userRankings: UserStatsType[]
  displaySize: DisplaySize
}
