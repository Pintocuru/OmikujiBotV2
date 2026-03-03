// src/MainGenerator/scripts/DisplayVariable/DisplayVariableResolver.ts
import { PostFlowType } from '@/types'
import { PlaceholderVariableType } from '@main/stores/PlaceholderVariable/PlaceholderVariable'

export class DisplayVariableResolver {
  constructor(private readonly context: PlaceholderVariableType) {}

  /**
   * PostAction配列のプレースホルダーを置換して返す
   */
  processPostActions(postActions: PostFlowType[]): PostFlowType[] {
    return postActions.map((action) => {
      if (action.actionType === 'message') {
        return {
          ...action,
          message: {
            ...action.message,
            bubble: this.resolve(action.message.bubble),
          },
        }
      }
      if (action.actionType === 'wordParty') {
        return { ...action, wordParty: this.resolve(action.wordParty) }
      }
      return action
    })
  }

  /**
   * [[key]] を現在の変数値で置換
   * 未定義時は {{key}} に変換
   */
  resolve(text?: string): string {
    if (!text) return ''
    const vars = this.context.getAll()
    return text.replace(/\[\[([^\]]+)\]\]/g, (_: string, key: string) => {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        return String(vars[key])
      }
      return `{{${key}}}`
    })
  }
}
