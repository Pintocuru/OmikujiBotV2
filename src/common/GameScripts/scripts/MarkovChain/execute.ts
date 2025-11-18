// src/execute.ts
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { RESPONSE_CONFIGS } from './responseConfigs'
import { MarkovBot } from './markovBot'
import { BotParams, BotParamsSchema, BotPlaceholder, BotSettings, BotSettingsSchema } from './params'

export class ExecuteScript implements ScriptClass<BotSettings, BotParams, BotPlaceholder> {
  private settings!: BotSettings
  private markovBot!: MarkovBot

  /**
   * 設定を初期化する
   */
  setup(settings: BotSettings): void {
    this.settings = BotSettingsSchema.parse(settings)
    this.markovBot = new MarkovBot()
  }

  /**
   * BOTを実行する
   */
  run(comment: Comment, params: BotParams): ScriptResult<BotPlaceholder> {
    const { responseStyle } = BotParamsSchema.parse(params)
    const { minLength } = BotSettingsSchema.parse(params)

    // 設定データ
    const userName = comment?.data.displayName ?? 'ゲスト'

    // 応答スタイルに応じたコーパスを取得
    const corpus = RESPONSE_CONFIGS[responseStyle]
    if (!corpus) throw new Error(`不明な応答スタイル: ${responseStyle}`)

    // マルコフ連鎖でテキスト生成
    const generatedText = this.markovBot.generate(corpus, minLength)

    return {
      postActions: [],
      placeholders: {
        message: generatedText,
        userName,
        responseStyle,
        textLength: generatedText.length,
      },
    }
  }

  /**
   * ゲームデータを返す
   */
  getGameState(): GameState | null {
    return null
  }
}

// プリセットから利用できるようにインスタンス化してエクスポート
const execute = new ExecuteScript()
export default execute
