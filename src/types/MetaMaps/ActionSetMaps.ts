// src/types/MetaMaps/ActionSetMaps.ts

/**
 * PostAction タイプのUI表示情報
 */
export const PostFlowKindMaps = {
  message: { label: 'メッセージ', icon: 'MessageSquare' },
  sound: { label: 'サウンド', icon: 'Volume2' },
  wordParty: { label: 'WordParty', icon: 'PartyPopper' },
  variable: { label: '評価ブロック', icon: 'Brackets' },
  bot: { label: 'BOTちゃん', icon: 'Bot' },

  // TODO(v3) : actionSet -> flowCall
  actionSet: { label: 'アクションセット', icon: 'MessagesSquare' },
} as const

/**
 * 特殊動作のUI表示情報
 */
export const actionSpecialMap = {
  return: {
    label: '処理を終了する(return)',
    description: 'BOTアクションを何もせず、このイベントで処理を終了します。',
  },
  continue: {
    label: '次のイベントへ進む(continue)',
    description: 'BOTアクションを何もせず、次のイベントへ処理を進めます。',
  },
  resetOmikuji: {
    label: 'おみくじ回数をリセットする(reset)',
    description: 'おみくじの抽選回数をリセットします。',
  },

  // --- log 系（4 種類に分割） ---
  logUserState: {
    label: 'ユーザー状態を出力する(logUserState)',
    description: 'コメントをしたユーザーの情報を、フォーマットに従って出力します。',
  },
  logOmikuji: {
    label: 'おみくじ履歴を出力する(logOmikuji)',
    description: 'このおみくじを発動したユーザーの情報を、フォーマットに従って出力します。',
  },
  logGame: {
    label: 'ゲーム状態を出力する(logGame)',
    description: 'ゲームスクリプト のランキングを出力します。',
  },
  logVariable: {
    label: '変数データを出力する(logVariable)',
    description: '評価ブロックの値を出力します。',
  },
} as const

/**
 * ActionSet カテゴリのUI表示情報
 */
export const actionSetKindMap = {
  postActions: {
    label: 'BOTアクション',
    description: '下記の内容をわんコメやジェネレーターで表示します',
    icon: 'Bot',
  },
  gameScripts: {
    label: 'ゲームスクリプト',
    description: 'ゲームを実行し、結果をわんコメやジェネレーターで表示します',
    icon: 'Gamepad2',
  },
  special: {
    label: '特殊動作',
    description: 'おみくじの実行フローを制御する特殊な処理',
    icon: 'Zap',
  },
} as const
