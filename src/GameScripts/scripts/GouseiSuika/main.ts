// src/main.ts
import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
import execute from './execute'

const pluginConfig = {
  name: 'GouseiSuika',
  version: '2.0.0',
  displayName: 'スイカジェネレーター',
  description: '米兜科技 合成大西瓜風のおみくじ',
  editorColor: '#388E3C',
  keywords: ['ポイント', 'ランキング', 'スイカ'],
  url: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/GouseiSuika/GouseiSuika.md',
  banner: 'https://github.com/Pintocuru/OmikujiBot-Docs/raw/main/solo/GouseiSuika/images/thumb_GouseiSuika.webp',
}

const plugin: ScriptPreset = {
  id: pluginConfig.name, // プラグインID
  key: pluginConfig.name,
  name: pluginConfig.displayName, // プラグイン名
  description: pluginConfig.description, // 説明
  createdAt: '2025/08/10 16:45',
  updatedAt: '2025/12/15 12:21',
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
