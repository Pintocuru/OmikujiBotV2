// src/common/GameScripts/scripts/GoogolClover/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostActionType, GameStateType, PostActionMessageSchema, ScriptResult } from '@/types/'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { GameContext, playSlot } from './game'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@game/parseQueryString'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { UserState } from './sub/types'
import { buildBotMessages, prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'

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
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): ScriptResult {
    const {} = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    const context: GameContext = {
      userId: omiken?.userId ?? UNKNOWN_NAME,
      userName: omiken?.userName ?? UNKNOWN_NAME,
      profileImage: omiken?.profileImage ?? '',
      rankingKey: RANKING_KEY,
    }

    // ゲームの実行
    // ! メッセージの生成に失敗してる(責務が重すぎる)作り直し
    const gameResult = playSlot(this.userStates, context)

    /**
    const botMessages = buildBotMessages({
      user,
      characterKey,
      bubbleText: gameResult.message,
      scriptKey: RANKING_KEY,
      score: gameResult.payout,
      symbol: gameResult.symbol,
      logResult,
    })
 */
    // PostActionとBotMessageに分離
    // TODO:buildBotMessages を適用すること
    const postActions = this.buildPostActions(gameResult.botMessage, characterKey)
    // const botMessages = this.buildBotMessages(gameResult.botMessage, characterKey, omiken)

    return {
      actions: postActions,
      messages: [],
    }
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
    return gameResult.botMessage.bubble ?? ''
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
   * PostAction の構築（bubble は含めない）
   */
  private buildPostActions(
    botMessage: ReturnType<typeof playSlot>['botMessage'],
    characterKey: string
  ): PostActionType[] {
    // メッセージアクションは bubble のみを含む
    const messageAction = PostActionMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: botMessage.bubble,
      },
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

    return [...common, ...(botMessage.ranking.scoreValue ? successActions : failActions), messageAction]
  }
}

export default new ExecuteScript()
