// src/main.ts
import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
import execute from './execute'

const pluginConfig = {
  name: 'steal-em-all',
  version: '0.0.1',
  displayName: 'ダンジョンスロット',
  description: 'Nolimit City - Kill Em All/大都技研 盗忍！剛衛門 風のおみくじ',
  editorColor: '#333333',
  keywords: ['ポイント', 'ランキング', 'スロット'],
  url: '',
  banner: '',
}

const plugin: ScriptPreset = {
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
}

export default plugin
