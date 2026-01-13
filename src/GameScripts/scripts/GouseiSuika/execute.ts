// src/GameScripts/scripts/GouseiSuika/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, PostActionMessageSchema, ScriptResult } from '@/types/'
import { GachaGame } from './game'
import { parseQueryString } from '@game/parseQueryString'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessages } from '@game/scriptsEngine/RankingMessage/RankingMessage'

const RANKING_KEY = 'GouseiSuika'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()

    const user = prepareUserInfo(omiken)
    const bubbleText = `${user.userName}の得点は${gameResult.points}!`

    const logResult = omiken ? this.recordRanking(omiken, gameResult.points, characterKey) : null

    const botMessages = buildBotMessages({
      user,
      characterKey,
      bubbleText,
      scriptKey: RANKING_KEY,
      score: gameResult.points,
      symbol: params.mode,
      logResult,
    })

    return {
      actions: this.buildPostActions(gameResult, logResult, characterKey, bubbleText),
      messages: botMessages,
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
    characterKey: string
  ): ReturnType<LogRankScript['run']> {
    return this.logRank.run({
      userId: omiken.userId,
      userName: omiken.userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
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
    logResult: ReturnType<LogRankScript['run']> | null,
    characterKey: string,
    bubbleText: string
  ): PostActionType[] {
    const messageAction = PostActionMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: bubbleText,
      },
      sound: 'decision',
    })

    return [...gameResult.postArray, ...(logResult?.postActions ?? []), messageAction]
  }
}

export default new ExecuteScript()
