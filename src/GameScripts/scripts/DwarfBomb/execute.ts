// src/common/GameScripts/scripts/DwarfBomb/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostFlowType, GameStateType, PostFlowMessageSchema, ScriptResult } from '@/types/'
import { BomberSpinGame } from './game'
import { parseQueryString } from '@game/parseQueryString'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo, buildBotMessageRanking } from '@game/scriptsEngine/RankingMessage/RankingMessage'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

const RANKING_KEY = 'DwarfBomb'

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
    const partyEffects = gameResult.game.generatePartyEffects(gameResult.result)

    if (omiken) {
      // ランキングデータの記録
      const logResult = this.recordRanking(omiken, gameResult.payout, characterKey)

      // BotMessage の構築
      const botMessageExtra = buildBotMessageRanking({
        user,
        bubbleText: gameResult.result.message,
        componentKey: RANKING_KEY,
        score: gameResult.payout,
        symbol: '',
        isOverLimit: logResult.isOverLimit,
      })

      return {
        actions: this.buildPostActions(logResult.postActions, partyEffects, characterKey, gameResult.result.message),
        botMessageExtras: [botMessageExtra],
      }
    }
    // omiken(コメント)がない場合
    return {
      actions: this.buildPostActions(null, partyEffects, characterKey, gameResult.result.message),
      botMessageExtras: [],
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
   * PostAction の構築
   */
  private buildPostActions(
    postActions: PostFlowType[] | null,
    partyEffects: PostFlowType[],
    characterKey: string | null,
    bubbleText: string
  ): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: bubbleText,
      },
      sound: 'decision',
    })

    return [
      ...(postActions ?? []),
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
