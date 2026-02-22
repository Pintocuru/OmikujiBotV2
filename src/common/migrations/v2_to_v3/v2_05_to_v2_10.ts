// src/common/migrations/v2_to_v3/v2_05_to_v2_10.ts
import { ComponentsSchema } from '@/types/OmikujiData/UiSchema'
import { CharacterColorScheme } from '@/types/OmikujiData/CharacterSchema'

/**
 * v2.0.5 → v2.1.0 マイグレーション
 *
 * 変更内容:
 * - components.conditions を { slot, kind }[] 形式に変更
 * - components.commonStyle を新設 (fontFamily, defaultColor を分離)
 * - components.settings 配下に各設定を移動
 * - 各設定に slotType を追加
 */
export function migrateV205ToV210(data: any): any {
  const oldComponents = data.components || {}

  // 旧形式の conditions を取得 (文字列配列)
  const oldConditions = oldComponents.conditions || ['bubble', 'toast']

  // 旧形式の各設定を取得
  const oldBubble = oldComponents.bubble || {}
  const oldToast = oldComponents.toast || {}
  const oldRanking = oldComponents.ranking || {}
  const oldCounter = oldComponents.counter || {}

  // --- 新形式への変換 ---

  // 1. conditions を { slot, kind }[] 形式に変換
  const newConditions = oldConditions
    .map((kind: string) => {
      // 各kindに対応するslotを決定
      if (kind === 'bubble') return { slot: 'primary', kind: 'bubble' }
      if (kind === 'toast') return { slot: 'secondary', kind: 'toast' }
      if (kind === 'ranking') return { slot: 'extra', kind: 'ranking' }
      if (kind === 'counter') return { slot: 'extra', kind: 'counter' }
      return null
    })
    .filter(Boolean)
    .slice(0, 3) // 最大3つまで

  // conditionsが空の場合はデフォルト値
  const finalConditions =
    newConditions.length > 0
      ? newConditions
      : [
          { slot: 'primary', kind: 'bubble' },
          { slot: 'secondary', kind: 'toast' },
        ]

  // 2. commonStyle を作成 (bubbleから分離)
  const commonStyle = {
    fontFamily: oldBubble.fontFamily || 'default',
    defaultColor: oldBubble.defaultColor || CharacterColorScheme.parse({}),
  }

  // 3. settings 配下に各設定を移動 & slotType を追加
  const newBubble = {
    slotType: 'primary' as const,
    showCharacters: oldBubble.showCharacters,
    characterSize: oldBubble.characterSize,
    bubbleMotionEnter: oldBubble.bubbleMotionEnter,
    bubbleTextAnimate: oldBubble.bubbleTextAnimate,
    bubbleTextSpeed: oldBubble.bubbleTextSpeed,
    // fontFamily と defaultColor は commonStyle に移動したので除外
  }

  const newToast = {
    slotType: 'secondary' as const,
    showToastsOnRight: oldToast.showToastsOnRight,
    showToastsCharacter: oldToast.showToastsCharacter,
    showThumbnail: oldToast.showThumbnail,
  }

  const newRanking = {
    slotType: 'extra' as const,
    targetScriptKeys: oldRanking.targetScriptKeys,
    title: oldRanking.title,
    color: oldRanking.color,
    limit: oldRanking.limit,
    sortOrder: oldRanking.sortOrder,
    component: oldRanking.component,
  }

  const newCounter = {
    slotType: 'extra' as const,
    ruleKey: oldCounter.ruleKey,
    component: oldCounter.component,
    target: oldCounter.target,
    label: oldCounter.label,
    color: oldCounter.color,
  }

  // 4. 新しい components 構造を構築
  const newComponents = {
    conditions: finalConditions,
    commonStyle,
    settings: {
      bubble: newBubble,
      toast: newToast,
      ranking: newRanking,
      counter: newCounter,
    },
  }

  // 5. スキーマでバリデーション & デフォルト値適用
  const validatedComponents = ComponentsSchema.parse(newComponents)

  // 6. データ全体を更新
  return {
    ...data,
    components: validatedComponents,
    meta: {
      ...data.meta,
      dataVersion: 2.09003,
    },
  }
}
