// src/MainGenerator/scripts/EventProcess/ServiceProcessor.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MetaStateServiceType, MetaUpdateEvent, NormalizedMeta } from '@main/stores/MetaState/MetaStateService'
import { MetaRuleSchema, MetaRuleType, MetaTriggerSchema } from '@/types/OmikujiData/'
import { MetaRuleProcessor } from '@main/scripts/RuleProcess/MetaRuleProcessor'

// ─── トップレベルで関数参照を固定 ────────────────────────────────────────────
const { mockExecuteOmikuji, mockEvaluate } = vi.hoisted(() => ({
  mockExecuteOmikuji: vi.fn().mockReturnValue([]),
  mockEvaluate: vi.fn(),
}))

vi.mock('@main/scripts/OmikujiProcess/OmikujiProcessor', () => ({
  OmikujiProcessor: vi.fn().mockImplementation(() => ({
    executeOmikuji: mockExecuteOmikuji,
  })),
}))

// ✅ こう変える
vi.mock('@main/stores/MetaState/MetaTriggerEvaluator', () => ({
  evaluateMetaTrigger: mockEvaluate, // vi.hoisted の変数を使う
}))

// ─── ヘルパー ────────────────────────────────────────────────────────────────

function makeMetaStateMock(snapshot: NormalizedMeta | null = null): {
  mock: MetaStateServiceType
  triggerSubscriber: (event: MetaUpdateEvent) => void
} {
  let capturedFn: ((event: MetaUpdateEvent) => void) | null = null

  const mock: MetaStateServiceType = {
    subscribe: vi.fn((fn) => {
      capturedFn = fn
      return () => {
        capturedFn = null
      }
    }),
    subscribeError: vi.fn(() => () => {}),
    getStatus: vi.fn(() => 'ready' as const),
    getLastError: vi.fn(() => null),
    getCurrent: vi.fn(() => snapshot),
    getPeak: vi.fn(() => ({ upVote: 0, viewer: 0 })),
  }

  return {
    mock,
    triggerSubscriber: (event) => {
      if (!capturedFn) throw new Error('subscribeが呼ばれていません')
      capturedFn(event)
    },
  }
}
/**
 * テストイベント
 */
function makeRule(overrides: Partial<MetaRuleType> = {}): MetaRuleType {
  return MetaRuleSchema.parse({
    name: 'テストイベント',
    isEnabled: true,
    trigger: MetaTriggerSchema.parse({
      condition: 'upVote',
      upVote: { comparison: 'greaterThanPeak', value: 10 },
    }),
    ...overrides,
  })
}

function makeEvent(overrides: Partial<MetaUpdateEvent> = {}): MetaUpdateEvent {
  const current: NormalizedMeta = { isLive: false, upVote: 100, viewer: 50, follower: 10, startTime: null }
  return {
    current,
    previous: { upVote: 80, viewer: 40, follower: 10, startTime: null },
    peak: { upVote: 100, viewer: 50 },
    peakChanged: { upVote: false, viewer: false },
    ...overrides,
  }
}

// ─── テスト ──────────────────────────────────────────────────────────────────

describe('MetaRuleProcessor — executeOmikuji が呼ばれないケース', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExecuteOmikuji.mockReturnValue([]) // clearAllMocks で戻り値もリセットされるので再設定
  })

  it('metas が空オブジェクトのとき executeOmikuji は呼ばれない', () => {
    const { mock, triggerSubscriber } = makeMetaStateMock()
    const processor = new MetaRuleProcessor({}, mock)
    processor.startMetaRules(vi.fn())

    triggerSubscriber(makeEvent())

    expect(mockExecuteOmikuji).not.toHaveBeenCalled()
  })

  it('isEnabled=false のイベントは executeOmikuji が呼ばれない', () => {
    mockEvaluate.mockReturnValue(true)
    const rule = makeRule({ isEnabled: false })
    const { mock, triggerSubscriber } = makeMetaStateMock()
    const processor = new MetaRuleProcessor({ 'rule-1': rule }, mock)
    processor.startMetaRules(vi.fn())

    triggerSubscriber(makeEvent())

    expect(mockExecuteOmikuji).not.toHaveBeenCalled()
  })

  it('evaluateMetaTrigger が false のとき executeOmikuji は呼ばれない', () => {
    mockEvaluate.mockReturnValue(false)
    const rule = makeRule()
    const { mock, triggerSubscriber } = makeMetaStateMock()
    const processor = new MetaRuleProcessor({ 'rule-1': rule }, mock)
    processor.startMetaRules(vi.fn())

    triggerSubscriber(makeEvent())

    expect(mockExecuteOmikuji).not.toHaveBeenCalled()
    expect(mockEvaluate).toHaveBeenCalledOnce()
  })

  it('イベントが複数あり全て evaluateMetaTrigger=false なら executeOmikuji は呼ばれない', () => {
    mockEvaluate.mockReturnValue(false)
    const rules = {
      'rule-1': makeRule({ id: 'rule-1', order: 0 }),
      'rule-2': makeRule({ id: 'rule-2', order: 1 }),
      'rule-3': makeRule({ id: 'rule-3', order: 2 }),
    }
    const { mock, triggerSubscriber } = makeMetaStateMock()
    const processor = new MetaRuleProcessor(rules, mock)
    processor.startMetaRules(vi.fn())

    triggerSubscriber(makeEvent())

    expect(mockExecuteOmikuji).not.toHaveBeenCalled()
    expect(mockEvaluate).toHaveBeenCalledTimes(3)
  })

  it('stopMetaRules 後に subscribe コールバックが呼ばれても executeOmikuji は実行されない', () => {
    mockEvaluate.mockReturnValue(true)
    const rule = makeRule()
    const { mock } = makeMetaStateMock()
    const processor = new MetaRuleProcessor({ 'rule-1': rule }, mock)
    processor.startMetaRules(vi.fn())
    processor.stopMetaRules()

    expect(mock.subscribe).toHaveBeenCalledOnce()
    expect(mockExecuteOmikuji).not.toHaveBeenCalled()
  })

  it('startMetaRules を呼ばなければ executeOmikuji は呼ばれない', () => {
    const rule = makeRule()
    const { mock } = makeMetaStateMock()
    new MetaRuleProcessor({ 'rule-1': rule }, mock)

    expect(mock.subscribe).not.toHaveBeenCalled()
    expect(mockExecuteOmikuji).not.toHaveBeenCalled()
  })

  it('【対照】isEnabled=true かつ evaluateMetaTrigger=true なら executeOmikuji が呼ばれる', () => {
    mockEvaluate.mockReturnValue(true)
    const rule = makeRule()
    const { mock, triggerSubscriber } = makeMetaStateMock()
    const processor = new MetaRuleProcessor({ 'rule-1': rule }, mock)
    processor.startMetaRules(vi.fn())

    triggerSubscriber(makeEvent())

    expect(mockExecuteOmikuji).toHaveBeenCalledOnce()
    expect(mockExecuteOmikuji).toHaveBeenCalledWith(rule.omikuji)
  })
})
