// src/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, RankingMessageSchema, PostActionMessageSchema } from '@/types/'
import { GameEngine } from './game'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'
import { WordPartySelector } from './wordPartySelector'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

const RANKING_KEY = 'MultiplyBonanza'
const UNKNOWN_NAME = 'Unknown'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  /**
   * 設定を初期化する
   */
  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): PostActionType[] {
    const params = this.parseParams(queryString)
    const userName = omiken?.userName ?? UNKNOWN_NAME

    // ゲームの実行
    const gameResult = this.executeGame(userName, params.mode)

    // ランキングの生成
    const rankingResult = omiken ? this.createRanking(gameResult.result, characterKey, userName, omiken) : null

    // ゲーム結果に基づいてWordPartyを生成
    const wordPartyActions = this.selectWordParties(gameResult.result)

    return this.buildPostActions(gameResult, characterKey, wordPartyActions, rankingResult)
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const gameResult = this.executeGame('[ユーザー名]', mode)
    return gameResult.message
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  /**
   * パラメータ
   */
  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse(paramsObject)
  }

  // ゲームの実行
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
   * ランキング生成
   */
  private createRanking(
    gameResult: ReturnType<GameEngine['playGame']>,
    characterKey: string,
    userName: string,
    omiken: OmikenCommentType
  ) {
    const logResult = this.logRank.run({
      userId: omiken.userId,
      name: userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: gameResult.payout,
      },
    })

    const stats = logResult.currentUserStats
    const record = logResult.currentRecord

    const ranking = RankingMessageSchema.parse({
      scriptKey: RANKING_KEY,
      name: stats.name,
      scoreText: String(gameResult.payout),
      scoreValue: record.score,
      symbol: gameResult.symbol,
      isRank: !logResult.isOverLimit,
    })

    return {
      ranking,
      postActions: logResult.postActions,
    }
  }

  private selectWordParties(gameResult: ReturnType<GameEngine['playGame']>): PostActionType[] {
    const selector = new WordPartySelector()
    return selector.selectWordParties(gameResult)
  }

  /**
   * 投稿
   */
  private buildPostActions(
    game: {
      result: ReturnType<GameEngine['playGame']>
      message: string
    },
    characterKey: string,
    wordPartyActions: PostActionType[],
    rankingResult: {
      ranking: unknown
      postActions: PostActionType[]
    } | null
  ): PostActionType[] {
    return [
      ...(rankingResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: game.result.party },
      { actionType: 'wordParty', delaySeconds: 3.2, wordParty: 'MultiplyBonanzaCracker1' },
      ...wordPartyActions,
      PostActionMessageSchema.parse({
        delaySeconds: 3.5,
        characterKey,
        message: {
          bubble: game.message,
          ranking: rankingResult?.ranking,
        },
        sound: 'decision',
      }),
    ]
  }
}

export default new ExecuteScript()
