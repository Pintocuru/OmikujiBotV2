// src\common\GameScripts\scripts\BomberSpin\execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, UserNameType } from '@/types/'
import { playSlot } from './game'
import { LogRankScript } from '@/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/GameScripts/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { buildRankingMessage, prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'

const RANKING_KEY = 'BomberSpin'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): PostActionType[] {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    const gameResult = playSlot(user.name, params.symbol)

    const logResult = omiken ? this.recordRanking(omiken, gameResult.payout, characterKey) : null

    const rankingMessage = buildRankingMessage({
      user,
      characterKey,
      scriptKey: RANKING_KEY,
      score: gameResult.payout,
      symbol: gameResult.symbol,
      bubbleText: gameResult.message, // BomberSpin固有のメッセージ
      logResult,
    })

    return [...this.buildPostActions(gameResult, logResult), rankingMessage]
  }

  sampleRun(queryString: string): string {
    const { symbol } = this.parseParams(queryString)
    const gameResult = playSlot('[ユーザー名]', symbol)
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
   * ランキングデータを記録
   */
  private recordRanking(
    omiken: OmikenCommentType,
    payout: number,
    characterKey: string
  ): ReturnType<LogRankScript['run']> {
    return this.logRank.run({
      userId: omiken.userId,
      name: omiken.userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: payout,
      },
    })
  }

  /**
   * 投稿アクションの構築
   */
  private buildPostActions(
    gameResult: ReturnType<typeof playSlot>,
    logResult: ReturnType<LogRankScript['run']> | null
  ): PostActionType[] {
    return [
      ...(logResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'BomberSpinBack' },
      { actionType: 'wordParty', delaySeconds: 1.1, wordParty: gameResult.party },
      { actionType: 'wordParty', delaySeconds: 2.8, wordParty: 'CommonBombFire' },
    ]
  }
}

export default new ExecuteScript()
