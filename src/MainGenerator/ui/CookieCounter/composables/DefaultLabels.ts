// src/MainGenerator/ui/StreamCounter/composables/DefaultLabels.ts
import type { Component } from 'vue'
import { StreamDefaultKey } from '@/types'
import { ThumbsUp, Eye, Sprout, MessageCircle, Users, BadgeDollarSign, UserPlus } from 'lucide-vue-next'

export const LIVER_LUCIDE_LABELS: Record<StreamDefaultKey, string | Component> = {
  upVote: ThumbsUp,
  viewer: Eye,
  syoken: Sprout,
  commenter: Users,
  lc: MessageCircle,
  totalPrice: BadgeDollarSign,
  follower: UserPlus,
}

export const LIVER_EMOJI_LABELS: Record<StreamDefaultKey, string> = {
  upVote: '👍',
  viewer: '👀',
  syoken: '🌱',
  commenter: '👥',
  lc: '💬',
  totalPrice: '💰',
  follower: '🤝',
}

export const LIVER_TEXT_LABELS: Record<StreamDefaultKey, string> = {
  upVote: '高評価',
  viewer: '同接数',
  syoken: '初コメ',
  commenter: 'リスナー',
  lc: 'コメント',
  totalPrice: 'ギフト',
  follower: '登録者数',
}
