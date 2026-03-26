// src/ConfigMaker/components/appItems/preview/staticSectionPreviewMap.ts
import type { Component } from 'vue'

import BaseSettings from './BaseSettings.vue'
import ThresholdPreview from './ThresholdPreview.vue'
import LimitsPreview from './LimitsPreview.vue'
import OmikujiSetPreview from './OmikujiSetPreview.vue'
import TimerIntervalPreview from './TimerIntervalPreview.vue'
// import TriggerPreview from './TriggerPreview.vue'       // metas / reactions 用（ServiceTrigger / ReactionTrigger）
// import PlaceholderPreview from './PlaceholderPreview.vue'
// import ColorSettingsPreview from './ColorSettingsPreview.vue'
// import CommentVoicePreview from './CommentVoicePreview.vue'
// import ImageSettingsPreview from './ImageSettingsPreview.vue'

export const staticSectionPreviewMap: Record<string, Component> = {
  // ── 共通 ───────────────────────────────────────────────
  baseSettings: BaseSettings,
  omikujiSet: OmikujiSetPreview,

  // ── comments ───────────────────────────────────────────
  threshold: ThresholdPreview, // data.trigger を参照
  limits: LimitsPreview, // data.limits を参照

  // ── timers ─────────────────────────────────────────────
  timerInterval: TimerIntervalPreview,

  // ── metas / reactions（trigger 形状が異なるため別途対応予定）
  // trigger: TriggerPreview,

  // ── placeholders ───────────────────────────────────────
  // placeholder: PlaceholderPreview,

  // ── characters ─────────────────────────────────────────
  // colorSettings: ColorSettingsPreview,
  // commentVoice: CommentVoicePreview,
  // imageSettings: ImageSettingsPreview,
}
