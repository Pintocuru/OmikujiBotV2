// src/common/GameScripts/scripts/BomberSpin/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, PostActionMessageSchema, ScriptResult, BaseScript } from '@/types/'
import { playSlot } from './game'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@game/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessageRanking } from '@game/scriptsEngine/RankingMessage/RankingMessage'

const RANKING_KEY = 'BomberSpin'

export class ExecuteScript extends BaseScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    super()
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const { symbol, spin } = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)
    const gameResult = playSlot(user.userName, symbol, spin)

    const logResult = omiken ? this.recordRanking(omiken, gameResult.payout, characterKey) : null

    const botMessageExtras = buildBotMessageRanking({
      user,
      bubbleText: gameResult.message,
      componentKey: RANKING_KEY,
      score: gameResult.payout,
      symbol: gameResult.symbol,
      logResult,
    })

    return {
      actions: this.buildPostActions(gameResult, logResult, characterKey),
      botMessageExtras,
    }
  }

  sampleRun(queryString: string): string {
    const { symbol, spin } = this.parseParams(queryString)
    const gameResult = playSlot('[ユーザー名]', symbol, spin)
    return gameResult.message
  }

  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse({
      symbol: paramsObject.symbol ?? '',
      spin: Number(paramsObject.spin),
    })
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
      userId: omiken.userId,
      userName: omiken.userName,
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
   * PostAction の構築（bubble のみ）
   */
  private buildPostActions(
    gameResult: ReturnType<typeof playSlot>,
    logResult: ReturnType<LogRankScript['run']> | null,
    characterKey: string | null
  ): PostActionType[] {
    const messageAction = PostActionMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: gameResult.message,
      },
      sound: 'decision',
    })

    return [
      ...(logResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'BomberSpinBack' },
      { actionType: 'wordParty', delaySeconds: 1.1, wordParty: gameResult.party },
      { actionType: 'wordParty', delaySeconds: 2.8, wordParty: 'CommonBombFire' },
      messageAction,
    ]
  }
}

export default new ExecuteScript()
