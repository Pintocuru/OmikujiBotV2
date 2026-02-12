// src/main.ts
import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
import execute from './execute'

const pluginConfig = {
  name: 'GoogolClover',
  version: '1.0.0',
  displayName: 'グーゴルクローバー',
  description: 'CloverPit風のおみくじ',
  editorColor: '#550000',
  keywords: ['ポイント', 'ランキング', 'スロット'],
  url: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/GoogolClover/GoogolClover.md',
  banner: 'https://github.com/Pintocuru/OmikujiBot-Docs/raw/main/solo/GoogolClover/images/thumb_GoogolClover.webp',
}

const plugin: ScriptPreset = {
  id: pluginConfig.name, // プラグインID
  key: pluginConfig.name,
  name: pluginConfig.displayName, // プラグイン名
  description: pluginConfig.description, // 説明
  createdAt: '2025/08/10 16:45',
  updatedAt: '2025/08/10 16:45',
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
