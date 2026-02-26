// src/types/MetaMaps/ActionSetMaps.ts
import { MessageSquare, PartyPopper, Volume2, MessagesSquare } from 'lucide-vue-next'

/**
 * PostAction タイプのUI表示情報
 */
// TODO(v3) : PostFlowKindMaps はRecord型にする
export const PostFlowKindMaps = [
  // TODO(v3) : type -> kind
  { type: 'message', label: 'メッセージ', icon: MessageSquare },
  { type: 'sound', label: 'サウンド', icon: Volume2 },
  { type: 'wordParty', label: 'WordParty', icon: PartyPopper },
  // TODO(v3) : actionSet -> flowCall
  { type: 'actionSet', label: 'アクションセット', icon: MessagesSquare },
] as const

/**
 * 特殊動作のUI表示情報
 */
export const actionSpecialMap = {
  return: {
    label: '処理を終了する(return)',
    description: 'このルールで処理を終了し、以降のルールは実行されません。',
    variant: 'warning',
  },
  continue: {
    label: '次のルールへ進む(continue)',
    description: '次のルールへ処理を進めます。通常の動作と同じです。',
    variant: 'info',
  },
  log: {
    label: 'ログを出力する(log)',
    description: 'わんコメにおみくじ回数のログを投稿します。',
    variant: 'success',
  },
  reset: {
    label: 'おみくじ回数をリセットする(reset)',
    description: 'おみくじの抽選回数をリセットします。',
    variant: 'neutral',
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
