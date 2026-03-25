// src/ConfigMaker/components/preview/staticSectionPreviewMap.ts
import type { Component } from 'vue'

// Previewコンポーネント
import BaseRecordPreview from './BaseRecordPreview.vue'
// import ThresholdPreview from './ThresholdPreview.vue'
// import LimitsPreview from './LimitsPreview.vue'
// import OmikujiSetPreview from './OmikujiSetPreview.vue'
// import TimerIntervalPreview from './TimerIntervalPreview.vue'
// import TriggerPreview from './TriggerPreview.vue'
// import PlaceholderPreview from './PlaceholderPreview.vue'
// import ColorSettingsPreview from './ColorSettingsPreview.vue'
// import CommentVoicePreview from './CommentVoicePreview.vue'
// import ImageSettingsPreview from './ImageSettingsPreview.vue'

// fallback用
// import DefaultPreview from './DefaultPreview.vue'

export const staticSectionPreviewMap: Record<string, Component> = {
  // 共通
  baseSettings: BaseRecordPreview,
  // omikujiSet: OmikujiSetPreview,
  //
  // // comments / reactions 系
  // threshold: ThresholdPreview,
  // limits: LimitsPreview,
  // trigger: TriggerPreview,
  //
  // // timers
  // timerInterval: TimerIntervalPreview,
  //
  // // placeholders
  // placeholder: PlaceholderPreview,
  //
  // // characters
  // colorSettings: ColorSettingsPreview,
  // commentVoice: CommentVoicePreview,
  // imageSettings: ImageSettingsPreview,
}
