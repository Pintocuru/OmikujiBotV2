// src/GameScripts/scripts/GouseiSuika/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostFlowType, GameStateType, PostFlowMessageSchema, ScriptResult } from '@/types'
import { GachaGame } from './game'
import { parseQueryString } from '@game/parseQueryString'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessageRanking } from '@game/scriptsEngine/RankingMessage/RankingMessage'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

const RANKING_KEY = 'GouseiSuika'

export class ExecuteScript extends GameScriptBase implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    super()
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()

    const user = prepareUserInfo(omiken)
    const bubbleText = `${user.userName}の得点は${gameResult.points}!`

    if (omiken) {
      const logResult = this.recordRanking(omiken, gameResult.points, characterKey)

      const botMessageExtra = buildBotMessageRanking({
        user,
        bubbleText,
        componentKey: RANKING_KEY,
        score: gameResult.points,
        symbol: params.mode,
        isOverLimit: logResult.isOverLimit,
      })

      return {
        actions: this.buildPostActions(gameResult, logResult.postActions, characterKey, bubbleText),
        botMessageExtras: [botMessageExtra],
      }
    }

    // omiken(コメント)がない場合
    return {
      actions: this.buildPostActions(gameResult, null, characterKey, bubbleText),
      botMessageExtras: [],
    }
  }

  sampleRun(queryString: string): string {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()
    return `[ユーザー名]の得点は${gameResult.points}!`
  }

  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  /**
   * ランキングデータを記録
   */
  private recordRanking(
    omiken: OmikenCommentType,
    points: number,
    characterKey: string | null
  ): ReturnType<LogRankScript['run']> {
    return this.logRank.run({
      user: UserNameSchema.parse(omiken),
      characterKey,
      rankingMode: 'high_score',
      maxDraws: 5,
      result: {
        type: 'score',
        score: points,
      },
    })
  }

  /**
   * PostAction の構築
   */
  private buildPostActions(
    gameResult: ReturnType<GachaGame['play']>,
    postActions: PostFlowType[] | null,
    characterKey: string | null,
    bubbleText: string
  ): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: bubbleText,
      },
      sound: 'decision',
    })

    return [...gameResult.postArray, ...(postActions ?? []), messageAction]
  }
}

export default new ExecuteScript()
