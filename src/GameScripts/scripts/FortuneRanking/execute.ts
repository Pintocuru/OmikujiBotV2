// src/GameScripts/scripts/FortuneRanking/execute.ts
import { DEFAULT_FRUITS, DEFAULT_KEY_MAP } from './params'
import { ScriptClass, GameStateType, PostFlowMessageSchema, ScriptResult } from '@/types'
import { LogRankScript } from '@game/scriptsEngine/LogRank/execute'
import { parseQueryString } from '@game/parseQueryString'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { GameScriptBase } from '@/types/GameScript/GameScriptBase'

const RANKING_KEY = 'FortuneRanking'

export class ExecuteScript extends GameScriptBase implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    super()
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string | null, _omiken?: OmikenCommentType): ScriptResult {
    const { projectName, fruitPairs } = this.parseParams(queryString)

    // シャッフルして順位決定
    const shuffled = [...fruitPairs].sort(() => Math.random() - 0.5)

    // {{fortune_xxx = n}} を連結生成
    const placeholders = shuffled
      .map((fruit, index) => {
        const rank = index + 1
        return `{{${projectName}_${fruit.key} = ${rank}}}`
      })
      .join('')

    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 0,
      characterKey,
      message: {
        bubble: placeholders + '占いランキングを作成したよ',
        isToast: true,
      },
      sound: 'decision',
    })

    return {
      actions: [messageAction],
      botMessageExtras: [],
    }
  }

  sampleRun(queryString: string): string {
    const { projectName, fruitPairs } = this.parseParams(queryString)
    const random = fruitPairs[Math.floor(Math.random() * fruitPairs.length)]

    return `${random.label}は {{${projectName}_${random.key}}} で順位が出るよ`
  }

  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  private parseParams(queryString: string) {
    const paramsObject = parseQueryString(queryString)

    const projectName = paramsObject.projectName ?? 'fortune'
    const fruitsRaw = paramsObject.fruits ?? ''

    // クエリ未指定ならデフォルト10種
    if (!fruitsRaw) {
      return {
        projectName,
        fruitPairs: DEFAULT_FRUITS.map((label) => ({
          label,
          key: DEFAULT_KEY_MAP[label],
        })),
      }
    }

    const fruitPairs = fruitsRaw.split(',').map((v) => {
      const [label, key] = v.split(':')
      return { label, key }
    })

    return {
      projectName,
      fruitPairs,
    }
  }
}

export default new ExecuteScript()
