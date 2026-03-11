// src/MainGenerator/ui/LiverCounter/composables/DefaultLabels.ts
import type { Component } from 'vue'
import { LiverDefaultKey } from '@/types'
import { ThumbsUp, Eye, Sprout, MessageCircle, Users, BadgeDollarSign } from 'lucide-vue-next'

export const LIVER_LUCIDE_LABELS: Record<LiverDefaultKey, string | Component> = {
  upVote: ThumbsUp,
  viewer: Eye,
  syoken: Sprout,
  commenter: Users,
  lc: MessageCircle,
  totalPrice: BadgeDollarSign,
}

export const LIVER_EMOJI_LABELS: Record<LiverDefaultKey, string> = {
  upVote: '👍',
  viewer: '👀',
  syoken: '🌱',
  commenter: '🧑‍🤝‍🧑',
  lc: '💬',
  totalPrice: '💰',
}

export const LIVER_TEXT_LABELS: Record<LiverDefaultKey, string> = {
  upVote: '高評価',
  viewer: '同接数',
  syoken: '初コメ',
  commenter: 'リスナー',
  lc: 'コメント',
  totalPrice: 'ギフト',
}
