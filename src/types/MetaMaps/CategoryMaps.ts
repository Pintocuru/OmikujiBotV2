// src/types/MetaMaps/CategoryMaps.ts

/**
 * カテゴリのUI表示情報
 */
export const categoryMap = {
  jsonMerge: {
    label: 'JSONマージ(Dev)',
    description: 'ビルド時、jsonファイルをマージして出力します',
    icon: 'Layers',
  },
  comments: {
    label: 'コメントイベント',
    description: 'チャット内容やユーザー情報を基におみくじを発動します',
    icon: 'MessageSquare',
  },
  timers: {
    label: 'タイマーイベント',
    description: '指定した時間経過で、自動的におみくじを発動します',
    icon: 'Timer',
  },
  metas: {
    label: '配信数値イベント',
    description: '配信の視聴数・高評価の変動でおみくじを発動します',
    icon: 'ThumbsUp',
  },
  reactions: {
    label: 'リアクションイベント(Youtube)',
    description: '視聴者のリアクション（❤ 😄 🎉 😳 💯）でおみくじを発動します',
    icon: 'Smile',
  },
  actionSets: {
    label: 'アクションセット',
    description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
    icon: 'Zap',
  },
  placeholders: {
    label: 'プレースホルダー',
    description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
    icon: 'Brackets',
  },
  characters: {
    label: 'キャラクター',
    description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
    icon: 'Users',
  },
  components: {
    label: 'アイテム',
    description: 'ジェネレーターで表示できる、アイテムの設定を行います',
    icon: 'LayoutGrid',
  },
  appInfo: {
    label: 'アプリ情報',
    description: 'ライセンスや使用できる機能を確認できます',
    icon: 'Info',
  },
  dataPacks: {
    label: 'データパック(Beta)',
    description: 'テンプレートデータを外部サーバから読み込みます',
    icon: 'Package',
  },
} as const
