// src\common\GameScripts\scripts\GoogolClover\execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, PostActionMessageSchema } from '@/types/'
import { GameContext, playSlot } from './game'
import { UserState } from './types'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@game/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

const RANKING_KEY = 'GoogolClover'
const UNKNOWN_NAME = 'Unknown'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()
  private readonly userStates = new Map<string, UserState>()

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

    const context: GameContext = {
      userId: omiken?.userId ?? UNKNOWN_NAME,
      userName: omiken?.userName ?? UNKNOWN_NAME,
      profileImage: omiken?.profileImage ?? '',
      rankingKey: RANKING_KEY,
    }

    // ゲームの実行
    const gameResult = playSlot(this.userStates, context)

    return this.buildPostActions(gameResult, characterKey)
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const {} = this.parseParams(queryString)
    const context: GameContext = {
      userId: UNKNOWN_NAME,
      userName: UNKNOWN_NAME,
      profileImage: '',
      rankingKey: RANKING_KEY,
    }

    // ゲームの実行
    const gameResult = playSlot(this.userStates, context)
    return gameResult.bubble ?? ''
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

  /**
   * 投稿
   */
  private buildPostActions(gameResult: ReturnType<typeof playSlot>, characterKey: string): PostActionType[] {
    const messageAction = PostActionMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: gameResult,
      sound: 'decision',
    })

    const common: PostActionType[] = [{ actionType: 'wordParty', delaySeconds: -1, wordParty: 'MaidenOmikujiLottery' }]

    const successActions: PostActionType[] = [
      { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji01' },
      { actionType: 'sound', delaySeconds: 1, sound: 'carnival' },
    ]

    const failActions: PostActionType[] = [
      { actionType: 'wordParty', delaySeconds: 0, wordParty: 'MaidenOmikuji07' },
      { actionType: 'sound', delaySeconds: 1, sound: 'fail' },
      { actionType: 'wordParty', delaySeconds: 1, wordParty: 'GoogolCloverFail' },
    ]

    return [...common, ...(gameResult.ranking?.scoreValue ? successActions : failActions), messageAction]
  }
}

export default new ExecuteScript()
