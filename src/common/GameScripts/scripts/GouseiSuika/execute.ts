// src/execute.ts
import { GameParamsSchema } from './params'
import { ScriptClass, GameState, ScriptResult, PostActionType } from '@/types/'
import { GachaGame } from './game'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { Comment } from '@onecomme.com/onesdk/'
import { GameResult } from './gameConfigs'

const RANKING_KEY = 'GouseiSuika'
const UNKNOWN_NAME = 'Unknown'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  /** ゲームを実行 */
  run(params: string, characterKey: string, comment?: Comment): ScriptResult {
    const { mode } = this.parseParams(params)

    const gameResult = new GachaGame(mode).play()
    const rankingActions = this.buildRankingActions(gameResult, characterKey, comment)

    return {
      postActions: [...gameResult.postArray, ...rankingActions],
    }
  }

  /** ゲームデータを返す */
  getGameState(): GameState {
    return this.logRank.getGameState()
  }

  // ---- private helpers ----

  private parseParams(params: string) {
    const paramsObject = parseQueryString(params)
    return GameParamsSchema.parse(paramsObject)
  }

  private buildRankingActions(gameResult: GameResult, characterKey: string, comment?: Comment): PostActionType[] {
    if (!comment) return []

    const logResult = this.logRank.run({
      userId: comment.data.userId,
      name: comment.data.displayName ?? UNKNOWN_NAME,
      characterKey,
      rankMode: 'point',
      enableCount: 5,
      isWin: false,
      getPoint: gameResult.points,
    })

    if (logResult.currentUserStats.isOverLimit)
      return [
        ...logResult.postActions,
        {
          actionType: 'message',
          delaySeconds: 3.5,
          characterKey,
          iconKey: 'default',
          message: {
            bubble: `${comment.data.displayName ?? UNKNOWN_NAME}の得点は${gameResult.points}!`,
            rankingKey: RANKING_KEY,
            rankingDisplayScore: String(gameResult.points),
          },
          sound: 'decision',
        },
      ]

    const stats = logResult.currentUserStats

    return [
      ...logResult.postActions,
      {
        actionType: 'message',
        delaySeconds: 3.5,
        characterKey,
        iconKey: 'default',
        message: {
          bubble: `${comment.data.displayName ?? UNKNOWN_NAME}の得点は${gameResult.points}!`,
          rankingKey: RANKING_KEY,
          rankingDisplayScore: String(gameResult.points),
          rankingRank: stats.rank != null ? String(stats.rank) : undefined,
          rankingName: stats.name,
          rankingPoint: String(stats.points),
          rankingSymbol: stats.itemValue1,
        },
        sound: 'decision',
      },
    ]
  }
}

// プリセット用エクスポート
export default new ExecuteScript()

export function parseQueryString(queryString: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(queryString))
}
