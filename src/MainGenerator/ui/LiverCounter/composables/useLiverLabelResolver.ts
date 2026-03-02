// src/MainGenerator/ui/LiverCounter/composables/useLiverLabelResolver.ts
import type { Component } from 'vue'
import { DEFAULT_LABELS } from './DefaultLabels'
import type { LiverDefaultKey } from '@/types'

export function useLiverLabelResolver(eventLabels: Record<string, string>) {
  const getLabel = (key: string): string | Component => {
    if (key in DEFAULT_LABELS) return DEFAULT_LABELS[key as LiverDefaultKey]
    return eventLabels[key] ?? key
  }

  const isComponent = (label: string | Component): label is Component => typeof label !== 'string'

  return { getLabel, isComponent }
}
