// src/common/GameScripts/scripts/DwarfBomb/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, PostActionMessageSchema } from '@/types/'
import { BomberSpinGame } from './game'
import { parseQueryString } from '@/GameScripts/parseQueryString'
import { LogRankScript } from '@/GameScripts/scriptsEngine/LogRank/execute'
import { RankingMessageSchema } from '@/types/OmikujiData/PostActionMessage'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

const RANKING_KEY = 'DwarfBomb'
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
    const rankingResult = omiken ? this.createRanking(gameResult.payout, characterKey, userName, omiken) : null

    // ゲーム結果に基づいてWordPartyを生成
    const partyEffects = gameResult.game.generatePartyEffects(gameResult.result)

    return this.buildPostActions(gameResult.result, characterKey, partyEffects, rankingResult)
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const gameResult = this.executeGame('[ユーザー名]', mode)
    return gameResult.result.message
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
    const game = new BomberSpinGame()
    const result = game.playGame(userName, mode)

    return {
      game,
      result,
      payout: result.payout,
    }
  }

  /**
   * ランキング生成
   */
  private createRanking(payout: number, characterKey: string, userName: string, omiken: OmikenCommentType) {
    const logResult = this.logRank.run({
      userId: omiken.userId,
      name: userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: payout,
      },
    })

    const stats = logResult.currentUserStats
    const record = logResult.currentRecord

    const ranking = RankingMessageSchema.parse({
      scriptKey: RANKING_KEY,
      name: stats.name,
      scoreText: String(payout),
      scoreValue: record.score,
      isRank: !logResult.isOverLimit,
    })

    return {
      ranking,
      postActions: logResult.postActions,
    }
  }

  /**
   * 投稿
   */
  private buildPostActions(
    gameResult: ReturnType<BomberSpinGame['playGame']>,
    characterKey: string,
    partyEffects: PostActionType[],
    rankingResult: {
      ranking: unknown
      postActions: PostActionType[]
    } | null
  ): PostActionType[] {
    return [
      ...(rankingResult?.postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'DwarfBombRabbit1' },
      { actionType: 'wordParty', delaySeconds: 1.5, wordParty: 'DwarfBombRabbit2' },
      { actionType: 'wordParty', delaySeconds: 2, wordParty: 'DwarfBombRabbit3' },
      { actionType: 'wordParty', delaySeconds: 2.7, wordParty: 'CommonBombFire' },
      ...partyEffects,
      PostActionMessageSchema.parse({
        delaySeconds: 3.5,
        characterKey,
        message: {
          bubble: gameResult.message,
          ranking: rankingResult?.ranking,
        },
        sound: 'decision',
      }),
    ]
  }
}

export default new ExecuteScript()
