// src/ConfigMaker/components/placeholders/composables/useTextModeParser.ts
import { ref, computed } from 'vue'
import { WeightValuesArrayType, WeightValueSchema } from '@/types'

export function useTextModeParser() {
  const textContent = ref('')
  const lineCount = ref(0)

  // 行をパースしてバリデーション
  const parseAndValidateLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed) return null

    const parts = trimmed.split(',')
    const candidate =
      parts.length === 2 && !isNaN(parseInt(parts[0].trim()))
        ? { weight: parseInt(parts[0].trim()), content: parts[1].trim() }
        : { weight: 1, content: trimmed }

    const result = WeightValueSchema.safeParse(candidate)

    return {
      ...candidate,
      hasError: !result.success,
      error: result.success ? '' : getErrorMessage(result.error),
    }
  }

  // エラーメッセージを日本語化
  const getErrorMessage = (error: any) => {
    const issue = error.issues?.[0]
    if (issue?.path?.[0] === 'weight') return '重みは1以上の整数である必要があります'
    if (issue?.path?.[0] === 'content') return '内容が必要です'
    return '不正な値です'
  }

  // プレビューアイテム
  const previewItems = computed(() =>
    textContent.value
      .split('\n')
      .map(parseAndValidateLine)
      .filter((item) => item !== null)
  )

  // バリデーション状態
  const hasErrors = computed(() => previewItems.value.some((item) => item.hasError))

  const validItemsCount = computed(() => previewItems.value.filter((item) => !item.hasError).length)

  const errorCount = computed(() => previewItems.value.filter((item) => item.hasError).length)

  // 行数更新
  const updateLineCount = () => {
    lineCount.value = textContent.value.split('\n').length
  }

  // 値からテキストに変換
  const convertValuesToText = (values: WeightValuesArrayType) => {
    textContent.value = values
      .map((value) => {
        if (typeof value === 'object') {
          if (value.weight === 1) return value.content
          return `${value.weight},${value.content}`
        }
        return value
      })
      .join('\n')
    updateLineCount()
  }

  // テキストから値に変換
  const convertTextToValues = (): WeightValuesArrayType => {
    return previewItems.value.filter((item) => !item.hasError).map(({ weight, content }) => ({ weight, content }))
  }

  return {
    textContent,
    lineCount,
    previewItems,
    hasErrors,
    validItemsCount,
    errorCount,
    updateLineCount,
    convertValuesToText,
    convertTextToValues,
  }
}
