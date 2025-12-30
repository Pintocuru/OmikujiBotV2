// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\GameScripts\scripts\MultiplyBonanza\execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType } from '@/types/'
import { GameEngine } from './game'
import { LogRankScript } from '@/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/GameScripts/parseQueryString'
import { WordPartySelector } from './wordPartySelector'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { buildRankingMessage, prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'

const RANKING_KEY = 'MultiplyBonanza'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): PostActionType[] {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    // ゲームの実行
    const gameResult = this.executeGame(user.name, params.mode)

    // ランキングデータの記録
    const logResult = omiken ? this.recordRanking(omiken, gameResult.result.payout, characterKey) : null

    // ランキングメッセージの構築
    const rankingMessage = buildRankingMessage({
      user,
      characterKey,
      scriptKey: RANKING_KEY,
      score: gameResult.result.payout,
      symbol: gameResult.result.symbol,
      bubbleText: gameResult.message,
      logResult,
    })

    // ゲーム結果に基づいてWordPartyを生成
    const wordPartyActions = this.selectWordParties(gameResult.result)

    return this.buildPostActions(gameResult, wordPartyActions, logResult, rankingMessage)
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    const gameResult = this.executeGame(user.name, mode)
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
      engine,
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
   * WordPartyの選択
   */
  private selectWordParties(gameResult: ReturnType<GameEngine['playGame']>): PostActionType[] {
    const selector = new WordPartySelector()
    return selector.selectWordParties(gameResult)
  }

  /**
   * 投稿アクションの構築
   */
  private buildPostActions(
    game: {
      result: ReturnType<GameEngine['playGame']>
      message: string
    },
    wordPartyActions: PostActionType[],
    logResult: ReturnType<LogRankScript['run']> | null,
    rankingMessage: PostActionType
  ): PostActionType[] {
    return [
      ...(logResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: game.result.party },
      { actionType: 'wordParty', delaySeconds: 3.2, wordParty: 'MultiplyBonanzaCracker1' },
      ...wordPartyActions,
      rankingMessage,
    ]
  }
}

export default new ExecuteScript()
