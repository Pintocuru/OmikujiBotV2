// src/execute.ts
import { ScriptClass, GameState, ScriptResult } from '@/types/'
import { Comment } from '@onecomme.com/onesdk/'
import { RESPONSE_CONFIGS } from './responseConfigs'
import { RandomBot } from './randomBot'
import { BotParams, BotParamsSchema, BotPlaceholder, BotSettings, BotSettingsSchema } from './params'

export class ExecuteScript implements ScriptClass<BotSettings, BotParams, BotPlaceholder> {
  private settings!: BotSettings
  private randomBot!: RandomBot

  /**
   * 設定を初期化する
   */
  setup(settings: BotSettings): void {
    this.settings = BotSettingsSchema.parse(settings)
    this.randomBot = new RandomBot()
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

    // コーパスからランダムにテキスト生成
    const generatedText = this.randomBot.generate(corpus, userName)

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
