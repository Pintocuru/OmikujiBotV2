// src/main.ts
import { GameParams, GamePlaceholder, GameSettings, params, postActions, placeholders, settings } from './params'
import execute from './execute'
import { ScriptPreset } from '@/types/'
import { componentConfig } from './componentConfig'

const pluginConfig = {
  name: 'log-rank',
  version: '0.0.3',
  displayName: 'ランキング生成メーカー',
  description: 'パラメータを受け取ることで、ゲーム数や勝率を生成します。',
  editorColor: '#333333',
  keywords: ['ベース', '勝数', 'ポイント', '勝率', 'ランキング'],
  url: '',
  banner: '',
}

const plugin: ScriptPreset<GameSettings, GameParams, GamePlaceholder> = {
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
  componentConfig,
}

export default plugin
