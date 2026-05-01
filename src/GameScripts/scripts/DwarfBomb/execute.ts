// src/GameScripts/scripts/DwarfBomb/execute.ts
import { GameParams, GameParamsSchema } from './params'
import { ScriptClass, PostFlowType, GameStateType, PostFlowMessageSchema, ScriptResult } from '@/types'
import { playGame, generatePartyEffects } from './game/game' // ← クラスではなく関数をimport
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

    const result = playGame(user.userName, params.mode)
    const partyEffects = generatePartyEffects(result)

    if (omiken) {
      const logResult = this.recordRanking(omiken, result.payout, characterKey)

      const botMessageExtra = buildBotMessageRanking({
        user,
        bubbleText: result.message,
        componentKey: RANKING_KEY,
        score: result.payout,
        symbol: '',
        isOverLimit: logResult.isOverLimit,
      })

      return {
        actions: this.buildPostActions(logResult.postActions, partyEffects, characterKey, result.message),
        botMessageExtras: [botMessageExtra],
      }
    }

    return {
      actions: this.buildPostActions(null, partyEffects, characterKey, result.message),
      botMessageExtras: [],
    }
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    return playGame(user.userName, mode).message
  }

  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  private parseParams(queryString: string): GameParams {
    return GameParamsSchema.parse(parseQueryString(queryString))
  }

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
      result: { type: 'score', score: payout },
    })
  }

  private buildPostActions(
    postActions: PostFlowType[] | null,
    partyEffects: PostFlowType[],
    characterKey: string | null,
    bubbleText: string
  ): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: { bubble: bubbleText },
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
