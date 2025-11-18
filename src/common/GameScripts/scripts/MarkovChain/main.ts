// src/main.ts
import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
import { BotSettings, BotParams, BotPlaceholder, params, postActions, placeholders, settings } from './params'
import execute from './execute'

const pluginConfig = {
  name: 'MarkovChain',
  version: '0.0.1',
  displayName: 'マルコフ連鎖生成BOT',
  description: '確率的な単語の連鎖により、自動で文章を生成します。',
  editorColor: '#388E3C',
  keywords: ['マルコフ連鎖', '自動生成', '文章生成', 'Chain'],
  url: '',
  banner: '',
}

const plugin: ScriptPreset<BotSettings, BotParams, BotPlaceholder> = {
  id: pluginConfig.name, // プラグインID
  key: pluginConfig.name,
  name: pluginConfig.displayName, // プラグイン名
  description: pluginConfig.description, // 説明
  createdAt: '2025/08/10 16:45',
  updatedAt: '2025/08/27 12:21',
  accessLevel: 'basic',
  order: 0,
  editorColor: pluginConfig.editorColor, // 編集画面の色,
  version: pluginConfig.version, // バージョン
  author: 'Pintocuru', // 作者
  tags: pluginConfig.keywords, // タグ
  url: pluginConfig.url, // URL
  banner: pluginConfig.banner, // github にあるバナー画像
  execute,
  settings,
  params,
  postActions,
  placeholders,
  componentConfig: null,
}

export default plugin
