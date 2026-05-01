// src/GameScripts/scripts/HugEmAll/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostFlowType, GameStateType, PostFlowMessageSchema, ScriptResult } from '@/types'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { GameEngine } from './game'
import { parseQueryString } from '@game/parseQueryString'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessageRanking } from '@game/scriptsEngine/RankingMessage/RankingMessage'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

const RANKING_KEY = 'HugEmAll'

export class ExecuteScript extends GameScriptBase implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    super()
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    // ゲームの実行
    const gameResult = this.executeGame(user.userName, params.mode)

    if (omiken) {
      // ランキングデータの記録
      const logResult = this.recordRanking(omiken, gameResult.result.payout, characterKey)

      // BotMessage の構築
      const botMessageExtra = buildBotMessageRanking({
        user,
        bubbleText: gameResult.message,
        componentKey: RANKING_KEY,
        score: gameResult.result.payout,
        symbol: '',
        isOverLimit: logResult.isOverLimit,
      })

      return {
        actions: this.buildPostActions(logResult.postActions, characterKey, gameResult.message),
        botMessageExtras: [botMessageExtra],
      }
    }

    // omiken(コメント)がない場合
    return {
      actions: this.buildPostActions(null, characterKey, gameResult.message),
      botMessageExtras: [],
    }
  }

  sampleRun(queryString: string): string {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo()
    const gameResult = this.executeGame(user.userName, params.mode)
    return gameResult.message
  }

  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  /**
   * ゲームの実行
   */
  private executeGame(userName: string, mode: GameParams['mode']) {
    const engine = new GameEngine()
    const result = engine.playGame(mode)
    const message = engine.createMessage(userName, result)

    return {
      result,
      message,
    }
  }

  /**
   * ランキングデータを記録
   */
  private recordRanking(
    omiken: OmikenCommentType,
    payout: number,
    characterKey: string | null
  ): ReturnType<LogRankScript['run']> {
    return this.logRank.run({
      user: UserNameSchema.parse(omiken),
      characterKey,
      rankingMode: 'high_score',
      maxDraws: 5,
      result: {
        type: 'score',
        score: payout,
      },
    })
  }

  /**
   * PostAction の構築
   */
  private buildPostActions(
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

    return [
      ...(postActions ?? []),
      // TODO:演出の作成
      messageAction,
    ]
  }
}

export default new ExecuteScript()
