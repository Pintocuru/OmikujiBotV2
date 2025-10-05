// src\GameScripts\BomberSpin\src\main.ts
import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
import { GameParams, GamePlaceholder, GameSettings, params, postActions, placeholders, settings } from './params'
import execute from './execute'
import { componentConfig } from './componentConfig'

const pluginConfig = {
  name: 'BomberSpin',
  version: '1.0.0',
  displayName: 'ボンバースピン',
  description: 'APPLI BOMBERSPIN2風のおみくじ',
  editorColor: '#550000',
  keywords: ['ポイント', 'ランキング', 'スロット'],
  url: '',
  banner: '',
}

const plugin: ScriptPreset<GameSettings, GameParams, GamePlaceholder> = {
  id: pluginConfig.name, // プラグインID
  key: pluginConfig.name,
  name: pluginConfig.displayName, // プラグイン名
  description: pluginConfig.description, // 説明
  createdAt: '2025/08/10 16:45',
  updatedAt: '2025/08/10 16:45',
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
