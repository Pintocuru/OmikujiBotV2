// src/ConfigMaker/scripts/JsonClipboard/useJsonClipboard.ts
import { ref } from 'vue'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

type NotifyMessages = {
  copySuccess?: string
  copyError?: string
  pasteError?: string
}

type UseJsonClipboardOptions<T> = {
  parse: (raw: unknown) => T | null
  serialize?: (value: T) => unknown
  messages?: NotifyMessages
}

export function useJsonClipboard<T>(options: UseJsonClipboardOptions<T>) {
  const { serialize = (v: T) => v, parse } = options
  const msg = options.messages

  const isCopying = ref(false)
  const isPasting = ref(false)
  const lastError = ref<string | null>(null)

  const copyJson = async (value: T): Promise<boolean> => {
    lastError.value = null
    isCopying.value = true
    try {
      const json = JSON.stringify(serialize(value), null, 2)
      await navigator.clipboard.writeText(json)
      swalToast.success({ title: msg?.copySuccess ?? 'クリップボードにコピーしました' })
      return true
    } catch (e) {
      lastError.value = e instanceof Error ? e.message : 'コピーに失敗しました'
      swalToast.error({ title: msg?.copyError ?? `コピーに失敗しました: ${lastError.value}` })
      return false
    } finally {
      isCopying.value = false
    }
  }

  const pasteJson = async (): Promise<T | null> => {
    lastError.value = null
    isPasting.value = true
    try {
      const text = await navigator.clipboard.readText()
      let raw: unknown
      try {
        raw = JSON.parse(text)
      } catch {
        lastError.value = 'クリップボードの内容が JSON として読み取れませんでした'
        swalToast.error({ title: msg?.pasteError ?? lastError.value })
        return null
      }

      const result = parse(raw)
      if (result === null) {
        lastError.value = 'JSON の形式が一致しませんでした'
        swalToast.error({ title: msg?.pasteError ?? lastError.value })
      }
      return result
    } catch (e) {
      lastError.value = e instanceof Error ? e.message : 'ペーストに失敗しました'
      swalToast.error({ title: msg?.pasteError ?? lastError.value })
      return null
    } finally {
      isPasting.value = false
    }
  }

  return { copyJson, pasteJson, isCopying, isPasting, lastError }
}
