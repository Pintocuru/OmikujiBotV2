// src/main.ts
import { GameParams, GamePlaceholder, GameSettings, params, postActions, placeholders, settings } from './params'
import execute from './execute'
import configJson from '../config.json'
import { ScriptPreset } from '@/types/'
import { componentConfig } from './componentConfig'

const plugin: ScriptPreset<GameSettings, GameParams, GamePlaceholder> = {
  id: configJson.name, // プラグインID
  key: configJson.name,
  name: configJson.displayName, // プラグイン名
  description: configJson.description,
  createdAt: '2025/08/10 16:45',
  updatedAt: '2025/08/10 16:45',
  order: 0,
  editorColor: '#333333',
  version: configJson.version, // バージョン
  author: configJson.author, // 作者
  tags: configJson.keywords, // タグ
  url: '', // URL
  banner: '', //
  execute,
  settings,
  params,
  postActions,
  placeholders,
  componentConfig,
}

export default plugin
