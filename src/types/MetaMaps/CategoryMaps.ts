// src/types/MetaMaps/CategoryMaps.ts
import { MessageSquare, Timer, Brackets, Users, LayoutGrid, Info, Zap, Activity, Layers } from 'lucide-vue-next'
import type { CategoryType } from '../OmikujiData/CategoryType'

/**
 * カテゴリのUI表示情報
 */
export const categoryLabels: Record<CategoryType, { label: string; description: string; icon: any }> = {
  jsonMerge: {
    label: 'JSONマージ(Dev)',
    description: 'ビルド時、jsonファイルをマージして出力します',
    icon: Layers,
  },
  comments: {
    label: 'コメントルール',
    description: 'チャット内容やユーザー情報を基におみくじを発動します',
    icon: MessageSquare,
  },
  timers: {
    label: 'タイマールール',
    description: '指定した時間経過で、自動的におみくじを発動します',
    icon: Timer,
  },
  metas: {
    label: 'メタルール',
    description: '配信の視聴数・高評価の変動でおみくじを発動します',
    icon: Activity,
  },
  actionSets: {
    label: 'アクションセット',
    description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
    icon: Zap,
  },
  placeholders: {
    label: 'プレースホルダー',
    description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
    icon: Brackets,
  },
  characters: {
    label: 'キャラクター',
    description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
    icon: Users,
  },
  components: {
    label: 'アイテム',
    description: 'ジェネレーターで表示できる、アイテムの設定を行います',
    icon: LayoutGrid,
  },
  appInfo: {
    label: 'アプリ情報',
    description: 'ライセンスや使用できる機能を確認できます',
    icon: Info,
  },
}
