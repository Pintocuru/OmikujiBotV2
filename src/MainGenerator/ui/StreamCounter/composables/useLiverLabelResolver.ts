// src/MainGenerator/ui/StreamCounter/composables/useLiverLabelResolver.ts
import type { Component, Ref } from 'vue'
import { StreamDefaultKey, LiverLabelStyle } from '@/types'
import { LIVER_EMOJI_LABELS, LIVER_LUCIDE_LABELS, LIVER_TEXT_LABELS } from './DefaultLabels'

export function useLabelResolver(values: Ref<Record<string, string>>, labelStyle: Ref<LiverLabelStyle>) {
  const getLabel = (key: string): string | Component => {
    // デフォルトキーかどうか
    const isDefault = key in LIVER_LUCIDE_LABELS
    if (isDefault) {
      const k = key as StreamDefaultKey

      switch (labelStyle.value) {
        case 'lucide':
          return LIVER_LUCIDE_LABELS[k]
        case 'emoji':
          return LIVER_EMOJI_LABELS[k]
        case 'text':
          return LIVER_TEXT_LABELS[k]
      }
    }

    // デフォルトキーでない → 従来どおり text
    return values.value?.[key] ?? key
  }

  const isComponent = (label: string | Component): label is Component => typeof label !== 'string'

  return { getLabel, isComponent }
}
