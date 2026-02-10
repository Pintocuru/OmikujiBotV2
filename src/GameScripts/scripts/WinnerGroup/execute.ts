// src/GameScripts/scripts/WinnerGroup/execute.ts
import { ScriptClass, ScriptResult, PostActionType, BotMessageRankingType, BotMessageRankingSchema } from '@/types/'
import { parseQueryString } from '@game/parseQueryString'
import { PostActionMessageSchema } from '@/types/'
import { getWinnersFromVisitManager } from './game'
import { GameParamsSchema } from './params'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'
import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): ScriptResult {
    const rawParams = parseQueryString(queryString)
    const { count, label, useRule } = GameParamsSchema.parse(rawParams)
    const ruleKey = useRule ? omiken?.meta.ruleKey : null
    const user = prepareUserInfo(omiken)

    const winners = getWinnersFromVisitManager(count, ruleKey)
    const names = winners.map((w) => w.userName)
    const winnerText = names.length === 1 ? names[0] : names.join(' さん、') + ' さん'

    const delaySeconds = 1 // delaySeconds

    const messageAction: PostActionType = PostActionMessageSchema.parse({
      delaySeconds,
      characterKey,
      message: {
        bubble: `${label}は ${winnerText} です！`,
      },
      sound: 'decision',
    })

    const rankingMessage: BotMessageRankingType = BotMessageRankingSchema.parse({
      delaySeconds,
      user,
      ranking: {
        scriptKey: 'WinnerGroup',
        slots: buildSlots(winners),
      },
    })

    return {
      actions: [messageAction],
      rankingMessages: [rankingMessage],
    }
  }

  sampleRun(queryString: string): string {
    const rawParams = parseQueryString(queryString)
    const { count, label } = GameParamsSchema.parse(rawParams)

    const winners = getWinnersFromVisitManager(count)

    const names = winners.map((w) => w.userName)
    const winnerText = names.length === 1 ? names[0] : names.join(' さん、') + ' さん'

    return `${label}は ${winnerText} です！`
  }
}

export default new ExecuteScript()

// 最大10名のslotを自動生成
function buildSlots(winners: UserVisitRecord[]) {
  const slots: Record<string, string | undefined> = {}

  for (let i = 0; i < 10; i++) {
    slots[`slot${i}`] = winners[i]?.userId
  }

  return slots
}
