// src/MainGenerator/ui/StreamCounter/composables/DefaultLabels.ts
import type { Component } from 'vue'
import { StreamDefaultKey } from '@/types'
import {
  ThumbsUp,
  Eye,
  Sprout,
  MessageCircle,
  Users,
  BadgeDollarSign,
  UserPlus,
  Heart,
  MessageSquareMore,
} from 'lucide-vue-next'

export const LIVER_LUCIDE_LABELS: Record<StreamDefaultKey, Component> = {
  upVote: ThumbsUp,
  viewer: Eye,
  syoken: Sprout,
  commenter: Users,
  lc: MessageCircle,
  totalComments: MessageSquareMore,
  totalPrice: BadgeDollarSign,
  follower: UserPlus,
  reaction: Heart,
}

export const LIVER_EMOJI_LABELS: Record<StreamDefaultKey, string> = {
  upVote: '👍',
  viewer: '👀',
  syoken: '🌱',
  commenter: '👥',
  lc: '💬',
  totalComments: '🧮',
  totalPrice: '💰',
  follower: '🤝',
  reaction: '❤️',
}

export const LIVER_TEXT_LABELS: Record<StreamDefaultKey, string> = {
  upVote: '高評価',
  viewer: '同接数',
  syoken: '初コメ',
  commenter: 'リスナー',
  lc: 'コメント',
  totalComments: '累計コメント',
  totalPrice: 'ギフト',
  follower: '登録者数',
  reaction: 'リアクション',
}
