// src/ConfigMaker/components/appItems/preview/staticSectionPreviewMap.ts
import type { Component } from 'vue'

import BaseSettings from './BaseSettings.vue'
import ActionSetPreview from './ActionSetPreview.vue'
import ThresholdPreview from './ThresholdPreview.vue'
import LimitsPreview from './LimitsPreview.vue'
import OmikujiSetPreview from './OmikujiSetPreview.vue'
import TimerIntervalPreview from './TimerIntervalPreview.vue'
import TriggerPreview from './TriggerPreview.vue'
import PlaceholderPreview from './PlaceholderPreview.vue'
import ColorSettingsPreview from './ColorSettingsPreview.vue'
import CommentVoicePreview from './CommentVoicePreview.vue'
import ImageSettingsPreview from './ImageSettingsPreview.vue'

export const staticSectionPreviewMap: Record<string, Component> = {
  // ── 共通 ───────────────────────────────────────────────
  baseSettings: BaseSettings,
  omikujiSet: OmikujiSetPreview,
  actionSet: ActionSetPreview, // actionSets カテゴリ用（Events の omikujiSet リンク先でも利用）

  // ── comments ───────────────────────────────────────────
  threshold: ThresholdPreview, // mode デフォルト: 'threshold'
  limits: LimitsPreview,

  // ── timers ─────────────────────────────────────────────
  timerInterval: TimerIntervalPreview,

  // ── metas / reactions ──────────────────────────────────
  // SidebarSectionList 側で :mode="category" を渡すこと
  trigger: TriggerPreview,

  // ── placeholders ───────────────────────────────────────
  placeholder: PlaceholderPreview,

  // ── characters ─────────────────────────────────────────
  colorSettings: ColorSettingsPreview,
  commentVoice: CommentVoicePreview,
  imageSettings: ImageSettingsPreview,
}
