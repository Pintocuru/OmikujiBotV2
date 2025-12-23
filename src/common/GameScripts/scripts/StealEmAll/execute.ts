// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\common\GameScripts\scripts\StealEmAll\execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, RankingMessageSchema, PostActionMessageSchema } from '@/types/'
import { LogRankScript } from '@/common/GameScripts/scriptsEngine/LogRank/execute'
import { GameEngine } from './game'
import { parseQueryString } from '@/common/GameScripts/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

const RANKING_KEY = 'StealEmAll'
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
    const {} = this.parseParams(queryString)
    const userName = omiken?.userName ?? UNKNOWN_NAME

    // ゲームの実行
    const gameResult = this.executeGame(userName)

    /**
     * 型 '{ result: GameResult; message: string; }' の引数を型 'GameResult' のパラメーターに割り当てることはできません。
  型 '{ result: GameResult; message: string; }' には 型 'GameResult' からの次のプロパティがありません: stage, name, ways, payoutts(2345)
const gameResult: {
    result: GameResult;
    message: string;
}
     */
    // ランキングの生成
    const rankingResult = omiken ? this.createRanking(gameResult, characterKey, userName, omiken) : null

    return this.buildPostActions(gameResult, characterKey, rankingResult)
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const {} = this.parseParams(queryString)
    const gameResult = this.executeGame('[ユーザー名]')
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
  private executeGame(userName: string) {
    const engine = new GameEngine()
    const result = engine.playGame()
    const message = engine.createMessage(userName, result)

    return {
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
    game: {
      result: ReturnType<GameEngine['playGame']>
      message: string
    },
    characterKey: string,
    rankingResult: {
      ranking: unknown
      postActions: PostActionType[]
    } | null
  ): PostActionType[] {
    return [
      ...(rankingResult?.postActions ?? []),
      // TODO:演出の作成
      PostActionMessageSchema.parse({
        delaySeconds: 0.5,
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
