// src/MainGenerator/ui/LiverCounter/composables/DefaultLabels.ts
import type { Component } from 'vue'
import { LiverDefaultKey } from '@/types'
import { ThumbsUp, Eye, Sprout, MessageCircle, Users, BadgeDollarSign } from 'lucide-vue-next'

export const DEFAULT_LABELS: Record<LiverDefaultKey, string | Component> = {
  upVote: ThumbsUp,
  viewer: Eye,
  syoken: Sprout,
  commenter: Users,
  lc: MessageCircle,
  totalPrice: BadgeDollarSign,
}
