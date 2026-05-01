// src/GameScripts/scripts/MultiplyBonanza/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostFlowType, GameStateType, PostFlowMessageSchema, ScriptResult } from '@/types'
import { GameEngine } from './game'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@game/parseQueryString'
import { WordPartySelector } from './wordPartySelector'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessageRanking } from '@game/scriptsEngine/RankingMessage/RankingMessage'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

const RANKING_KEY = 'MultiplyBonanza'

export class ExecuteScript extends GameScriptBase implements ScriptClass {
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

    // ゲーム結果に基づいてWordPartyを生成
    const wordPartyActions = this.selectWordParties(gameResult.result)

    if (omiken) {
      // ランキングデータの記録
      const logResult = this.recordRanking(omiken, gameResult.result.payout, characterKey)

      // BotMessage の構築
      const botMessage = buildBotMessageRanking({
        user,
        bubbleText: gameResult.message,
        componentKey: RANKING_KEY,
        score: gameResult.result.payout,
        symbol: gameResult.result.symbol,
        isOverLimit: logResult.isOverLimit,
      })

      return {
        actions: this.buildPostActions(gameResult, wordPartyActions, logResult.postActions, characterKey),
        botMessageExtras: [botMessage],
      }
    }

    // omiken(コメント)がない場合
    return {
      actions: this.buildPostActions(gameResult, wordPartyActions, null, characterKey),
      botMessageExtras: [],
    }
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    const gameResult = this.executeGame(user.userName, mode)
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
    characterKey: string | null
  ): ReturnType<LogRankScript['run']> {
    return this.logRank.run({
      user: UserNameSchema.parse(omiken),
      characterKey,
      rankingMode: 'high_score',
      maxDraws: 5,
      result: {
        type: 'score',
        score: payout,
      },
    })
  }

  /**
   * WordPartyの選択
   */
  private selectWordParties(gameResult: ReturnType<GameEngine['playGame']>): PostFlowType[] {
    const selector = new WordPartySelector()
    return selector.selectWordParties(gameResult)
  }

  /**
   * PostAction の構築
   */
  private buildPostActions(
    gameResult: {
      result: ReturnType<GameEngine['playGame']>
      message: string
    },
    wordPartyActions: PostFlowType[],
    postActions: PostFlowType[] | null,
    characterKey: string | null
  ): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: gameResult.message,
      },
      sound: 'decision',
    })

    return [
      ...(postActions ?? []),
      { actionType: 'wordParty', delaySeconds: 1, wordParty: gameResult.result.party },
      { actionType: 'wordParty', delaySeconds: 3.2, wordParty: 'MultiplyBonanzaCracker1' },
      ...wordPartyActions,
      messageAction,
    ]
  }
}

export default new ExecuteScript()
