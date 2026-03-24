// src/MainGenerator/scripts/EventProcess/ServiceTriggerEvaluator.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { evaluateMetaTrigger, evaluateServiceCondition, evaluateElapsedTime } from './ServiceTriggerEvaluator'
import type { MetaUpdateEvent } from '../../stores/MetaState/MetaStateService'
import { MetaConditionType, MetaTriggerType } from '@/types'

describe('MetaTriggerEvaluator', () => {
  describe('evaluateServiceCondition', () => {
    describe('changed', () => {
      it('値が変化した場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'changed' }
        expect(evaluateServiceCondition(condition, 100, 50, true)).toBe(true)
      })

      it('値が変化していない場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'changed' }
        expect(evaluateServiceCondition(condition, 100, 100, false)).toBe(false)
      })
    })

    describe('increased', () => {
      it('値が増加した場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'increased' }
        expect(evaluateServiceCondition(condition, 100, 50, true)).toBe(true)
      })

      it('値が減少した場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'increased' }
        expect(evaluateServiceCondition(condition, 50, 100, false)).toBe(false)
      })

      it('値が変化していない場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'increased' }
        expect(evaluateServiceCondition(condition, 100, 100, false)).toBe(false)
      })
    })

    describe('decreased', () => {
      it('値が減少した場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'decreased' }
        expect(evaluateServiceCondition(condition, 50, 100, false)).toBe(true)
      })

      it('値が増加した場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'decreased' }
        expect(evaluateServiceCondition(condition, 100, 50, true)).toBe(false)
      })

      it('値が変化していない場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'decreased' }
        expect(evaluateServiceCondition(condition, 100, 100, false)).toBe(false)
      })
    })

    describe('greaterThanPeak', () => {
      it('ピーク値を超えた場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'greaterThanPeak' }
        expect(evaluateServiceCondition(condition, 150, 100, true)).toBe(true)
      })

      it('ピーク値と同じ場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'greaterThanPeak' }
        expect(evaluateServiceCondition(condition, 150, 100, false)).toBe(false)
      })

      it('ピーク値未満の場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'greaterThanPeak' }
        expect(evaluateServiceCondition(condition, 140, 100, false)).toBe(false)
      })
    })

    describe('lowerBound', () => {
      it('指定値以上の場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'lowerBound', value: 100 }
        expect(evaluateServiceCondition(condition, 150, 0, true)).toBe(true)
      })

      it('指定値と同じ場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'lowerBound', value: 100 }
        expect(evaluateServiceCondition(condition, 100, 0, true)).toBe(true)
      })

      it('指定値未満の場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'lowerBound', value: 100 }
        expect(evaluateServiceCondition(condition, 50, 0, true)).toBe(false)
      })

      it('valueがundefinedの場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'lowerBound' }
        expect(evaluateServiceCondition(condition, 150, 0, true)).toBe(false)
      })
    })

    describe('upperBound', () => {
      it('指定値以下の場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'upperBound', value: 100 }
        expect(evaluateServiceCondition(condition, 50, 0, true)).toBe(true)
      })

      it('指定値と同じ場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'upperBound', value: 100 }
        expect(evaluateServiceCondition(condition, 100, 0, true)).toBe(true)
      })

      it('指定値を超える場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'upperBound', value: 100 }
        expect(evaluateServiceCondition(condition, 150, 0, true)).toBe(false)
      })

      it('valueがundefinedの場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'upperBound' }
        expect(evaluateServiceCondition(condition, 50, 0, true)).toBe(false)
      })
    })

    describe('equal', () => {
      it('指定値と等しい場合はtrue', () => {
        const condition: MetaConditionType = { comparison: 'equal', value: 100 }
        expect(evaluateServiceCondition(condition, 100, 0, true)).toBe(true)
      })

      it('指定値と異なる場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'equal', value: 100 }
        expect(evaluateServiceCondition(condition, 99, 0, true)).toBe(false)
      })

      it('valueがundefinedの場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'equal' }
        expect(evaluateServiceCondition(condition, 100, 0, true)).toBe(false)
      })
    })

    describe('loop', () => {
      it('指定値の倍数で増加した場合はtrue (10増加)', () => {
        const condition: MetaConditionType = { comparison: 'loop', value: 10 }
        expect(evaluateServiceCondition(condition, 110, 100, true)).toBe(true)
      })

      it('指定値の倍数で増加した場合はtrue (20増加)', () => {
        const condition: MetaConditionType = { comparison: 'loop', value: 10 }
        expect(evaluateServiceCondition(condition, 120, 100, true)).toBe(true)
      })

      it('指定値の倍数でない増加の場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'loop', value: 10 }
        expect(evaluateServiceCondition(condition, 105, 100, true)).toBe(false)
      })

      it('減少した場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'loop', value: 10 }
        expect(evaluateServiceCondition(condition, 90, 100, false)).toBe(false)
      })

      it('変化がない場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'loop', value: 10 }
        expect(evaluateServiceCondition(condition, 100, 100, false)).toBe(false)
      })

      it('valueがundefinedの場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'loop' }
        expect(evaluateServiceCondition(condition, 110, 100, true)).toBe(false)
      })

      it('valueが0の場合はfalse', () => {
        const condition: MetaConditionType = { comparison: 'loop', value: 0 }
        expect(evaluateServiceCondition(condition, 110, 100, true)).toBe(false)
      })
    })

    describe('unknown comparison', () => {
      it('不明な比較方法の場合はfalse', () => {
        const condition = { comparison: 'unknown' } as any
        expect(evaluateServiceCondition(condition, 100, 50, true)).toBe(false)
      })
    })
  })

  describe('evaluateElapsedTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('経過時間が閾値以上の場合はtrue', () => {
      const now = Date.now()
      vi.setSystemTime(now)

      const startTime = now - 10 * 60_000 // 10分前
      expect(evaluateElapsedTime(5, startTime)).toBe(true)
    })

    it('経過時間が閾値未満の場合はfalse', () => {
      const now = Date.now()
      vi.setSystemTime(now)

      const startTime = now - 3 * 60_000 // 3分前
      expect(evaluateElapsedTime(5, startTime)).toBe(false)
    })

    it('経過時間が閾値ちょうどの場合はtrue', () => {
      const now = Date.now()
      vi.setSystemTime(now)

      const startTime = now - 5 * 60_000 // 5分前
      expect(evaluateElapsedTime(5, startTime)).toBe(true)
    })

    it('startTimeがnullの場合はfalse', () => {
      expect(evaluateElapsedTime(5, null)).toBe(false)
    })

    it('閾値が0の場合は常にtrue（開始直後でもOK）', () => {
      const now = Date.now()
      vi.setSystemTime(now)

      expect(evaluateElapsedTime(0, now)).toBe(true)
    })
  })

  describe('evaluateMetaTrigger', () => {
    const createEvent = (
      upVote: number,
      viewer: number,
      previousUpVote = 0,
      previousViewer = 0,
      startTime: number | null = 1000
    ): MetaUpdateEvent => ({
      current: { upVote, viewer, follower: 0, startTime },
      previous: { upVote: previousUpVote, viewer: previousViewer, follower: 0, startTime },
      peak: { upVote: Math.max(upVote, previousUpVote), viewer: Math.max(viewer, previousViewer) },
      peakChanged: { upVote: upVote > previousUpVote, viewer: viewer > previousViewer },
    })

    describe('upVote 条件', () => {
      it('upVote条件を正しく評価する', () => {
        const trigger: MetaTriggerType = {
          condition: 'upVote',
          upVote: { comparison: 'lowerBound', value: 100 },
        }
        const event = createEvent(150, 10)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })

      it('upVote条件が未定義の場合はtrue', () => {
        const trigger: MetaTriggerType = {
          condition: 'upVote',
        }
        const event = createEvent(50, 10)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })
    })

    describe('viewer 条件', () => {
      it('viewer条件を正しく評価する', () => {
        const trigger: MetaTriggerType = {
          condition: 'viewer',
          viewer: { comparison: 'increased' },
        }
        const event = createEvent(100, 50, 100, 30)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })

      it('viewer条件が未定義の場合はtrue', () => {
        const trigger: MetaTriggerType = {
          condition: 'viewer',
        }
        const event = createEvent(100, 10)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })
    })

    describe('elapsedMinutes 条件', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('経過時間条件を正しく評価する', () => {
        const now = Date.now()
        vi.setSystemTime(now)

        const trigger: MetaTriggerType = {
          condition: 'elapsedMinutes',
          elapsedMinutes: 5,
        }
        const event = createEvent(100, 10, 100, 10, now - 10 * 60_000)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })

      it('elapsedMinutesが未定義の場合は0として扱う', () => {
        const now = Date.now()
        vi.setSystemTime(now)

        const trigger: MetaTriggerType = {
          condition: 'elapsedMinutes',
        }
        const event = createEvent(100, 10, 100, 10, now)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })
    })

    describe('follower 条件', () => {
      it('follower条件は常にtrue', () => {
        const trigger: MetaTriggerType = {
          condition: 'follower',
          follower: true,
        }
        const event = createEvent(100, 10)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })
    })

    describe('condition なし', () => {
      it('conditionが未定義の場合はtrue', () => {
        const trigger = {} as MetaTriggerType
        const event = createEvent(100, 10)

        expect(evaluateMetaTrigger(trigger, event)).toBe(true)
      })
    })
  })
})
