// src/configMaker/components/placeholders/composables/usePlaceholderRandom.ts
import { ref, shallowRef } from 'vue'
import { PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'

/**
 * プレースホルダーのランダム値生成・更新を管理するcomposable
 * 解決方法1: shallowRefを使用してオブジェクト内部の変更を最適化
 */
export function usePlaceholderRandom() {
  // shallowRefを使用してパフォーマンスを向上
  const individualRandomTriggers = shallowRef<Record<string, number>>({})
  // 各プレースホルダーの現在の値をキャッシュ
  const cachedRandomValues = ref<Record<string, string>>({})

  // 個別のランダム値を取得（特定のプレースホルダー用）
  const getRandomValue = (placeholder: PlaceholderType): string => {
    const placeholderId = placeholder.id

    // 個別トリガーを参照してリアクティブにする
    const trigger = individualRandomTriggers.value[placeholderId] || 0

    // トリガーを参照（リアクティブ性のため）
    void trigger

    // キャッシュされた値があり、トリガーが変更されていない場合はそれを返す
    const cacheKey = `${placeholderId}-${trigger}`
    if (cachedRandomValues.value[cacheKey]) {
      return cachedRandomValues.value[cacheKey]
    }

    if (!placeholder.values?.length) return ''

    const randomIndex = Math.floor(Math.random() * placeholder.values.length)
    const selectedValue = placeholder.values[randomIndex]
    const result = typeof selectedValue === 'object' ? selectedValue.content : selectedValue || ''

    // 結果をキャッシュ
    cachedRandomValues.value[cacheKey] = result

    return result
  }

  // 特定のプレースホルダーのランダム値を更新
  const refreshRandomValue = (placeholderId: string) => {
    // 新しいオブジェクトを作成してリアクティブシステムに変更を通知
    const newTriggers = { ...individualRandomTriggers.value }
    newTriggers[placeholderId] = (newTriggers[placeholderId] || 0) + 1
    individualRandomTriggers.value = newTriggers

    // 古いキャッシュを削除
    Object.keys(cachedRandomValues.value).forEach((key) => {
      if (key.startsWith(`${placeholderId}-`)) {
        delete cachedRandomValues.value[key]
      }
    })
  }

  return {
    getRandomValue,
    refreshRandomValue,
  }
}
