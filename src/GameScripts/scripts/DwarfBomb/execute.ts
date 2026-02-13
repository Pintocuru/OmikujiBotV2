// src/common/GameScripts/scripts/DwarfBomb/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, PostActionMessageSchema, ScriptResult, BaseScript } from '@/types/'
import { BomberSpinGame } from './game'
import { parseQueryString } from '@game/parseQueryString'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessageRanking } from '@game/scriptsEngine/RankingMessage/RankingMessage'

const RANKING_KEY = 'DwarfBomb'

export class ExecuteScript extends BaseScript implements ScriptClass {
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

    // ランキングデータの記録
    const logResult = omiken ? this.recordRanking(omiken, gameResult.payout, characterKey) : null

    // BotMessage の構築
    const botMessageExtras = buildBotMessageRanking({
      user,
      bubbleText: gameResult.result.message,
      componentKey: RANKING_KEY,
      score: gameResult.payout,
      symbol: '',
      logResult,
    })

    // ゲーム結果に基づいてWordPartyを生成
    const partyEffects = gameResult.game.generatePartyEffects(gameResult.result)

    return {
      actions: this.buildPostActions(logResult, partyEffects, characterKey, gameResult.result.message),
      botMessageExtras,
    }
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    const gameResult = this.executeGame(user.userName, mode)
    return gameResult.result.message
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
    const game = new BomberSpinGame()
    const result = game.playGame(userName, mode)

    return {
      game,
      result,
      payout: result.payout,
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
   * PostAction の構築
   */
  private buildPostActions(
    logResult: ReturnType<LogRankScript['run']> | null,
    partyEffects: PostActionType[],
    characterKey: string | null,
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

    return [
      ...(logResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'DwarfBombRabbit1' },
      { actionType: 'wordParty', delaySeconds: 1.5, wordParty: 'DwarfBombRabbit2' },
      { actionType: 'wordParty', delaySeconds: 2, wordParty: 'DwarfBombRabbit3' },
      { actionType: 'wordParty', delaySeconds: 2.7, wordParty: 'CommonBombFire' },
      ...partyEffects,
      messageAction,
    ]
  }
}

export default new ExecuteScript()
