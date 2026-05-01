// src/GameScripts/scripts/WinnerGroup/execute.ts
import { ScriptClass, ScriptResult, PostFlowType, BotMessageExtraType, BotMessageExtraSchema } from '@/types'
import { parseQueryString } from '@game/parseQueryString'
import { PostFlowMessageSchema } from '@/types'
import { GameParamsSchema } from './params'
import { OmikenCommentType, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { prepareUserInfo } from '@/GameScripts/scriptsEngine/RankingMessage/RankingMessage'
import { getWinnersFromVisitManager } from './game'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

export class ExecuteScript extends GameScriptBase implements ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const rawParams = parseQueryString(queryString)
    const { count, label, useRule } = GameParamsSchema.parse(rawParams)
    const eventKey = useRule ? omiken?.omikuji?.eventKey : null
    const user = prepareUserInfo(omiken)

    const winners = getWinnersFromVisitManager(count, eventKey, this.userManager)
    const names = winners.map((w) => w.userName)
    const winnerText = names.length === 1 ? names[0] : names.join(' さん、') + ' さん'

    const delaySeconds = 1 // delaySeconds

    const messageAction: PostFlowType = PostFlowMessageSchema.parse({
      delaySeconds,
      characterKey,
      message: {
        bubble: `${label}は ${winnerText} です！`,
      },
      sound: 'decision',
    })

    const botMessageExtra: BotMessageExtraType = BotMessageExtraSchema.parse({
      delaySeconds,
      user,
      scriptKey: 'WinnerGroup',
      slots: buildSlots(winners),
    })

    return {
      actions: [messageAction],
      botMessageExtras: [botMessageExtra],
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
function buildSlots(winners: UserNameType[]) {
  const slots: Record<string, string | undefined> = {}

  for (let i = 0; i < 10; i++) {
    slots[`slot${i}`] = winners[i]?.userId
  }

  return slots
}
