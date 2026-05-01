// src/ConfigMaker/UiEditor/StreamCounter/CounterSelector/counterTypes.ts
import { streamDefaultMap } from '@/types'

export interface CounterItem {
  id: string
  type: 'default' | 'event' | 'variable'
  target: string
  label?: string
}

export interface EventRule {
  key: string
  name: string
}

export const getCounterLabel = (c: CounterItem, eventRules: EventRule[]): string => {
  if (c.type === 'default') {
    return streamDefaultMap[c.target as keyof typeof streamDefaultMap] ?? c.target
  }
  if (c.label) return c.label
  if (c.type === 'event') {
    return eventRules.find((r) => r.key === c.target)?.name ?? c.target
  }
  return c.target
}
