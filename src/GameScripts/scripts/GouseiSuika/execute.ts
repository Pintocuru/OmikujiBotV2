// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\GameScripts\scripts\GouseiSuika\execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType } from '@/types/'
import { GachaGame } from './game'
import { parseQueryString } from '@/GameScripts/parseQueryString'
import { LogRankScript } from '@/GameScripts/scriptsEngine/LogRank/execute'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { buildRankingMessage, prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'

const RANKING_KEY = 'GouseiSuika'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): PostActionType[] {
    const params = this.parseParams(queryString)
    const gameResult = new GachaGame(params).play()
    const rankingActions = this.buildRankingActions(omiken, gameResult.points, characterKey, params.mode)

    return [...gameResult.postArray, ...rankingActions]
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
   * ランキング関連のアクションを構築
   * 1. ランキングデータを記録（omikenがある場合のみ）
   * 2. ランキングメッセージを生成
   */
  private buildRankingActions(
    omiken: OmikenCommentType | undefined,
    points: number,
    characterKey: string,
    symbol: string
  ): PostActionType[] {
    // ユーザー情報の準備
    const user = prepareUserInfo(omiken)

    const bubbleText = `${user.name}の得点は${points}!`

    // ランキングデータの記録と取得
    const logResult = omiken ? this.recordRanking(omiken, points, characterKey) : null

    // メッセージの構築
    const rankingMessage = buildRankingMessage({
      user,
      characterKey,
      scriptKey: RANKING_KEY,
      score: points,
      symbol,
      logResult,
      bubbleText,
    })

    // ランキングのpostActionsとメッセージを結合
    const rankingPostActions = logResult?.postActions ?? []
    return [...rankingPostActions, rankingMessage]
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
      name: omiken.userName,
      characterKey,
      rankingMode: 'high_score',
      maxDrawsPerUser: 5,
      result: {
        type: 'score',
        score: points,
      },
    })
  }
}

export default new ExecuteScript()
