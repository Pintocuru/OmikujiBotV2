// src/GameScripts/scripts/WinnerGroup/main.ts
import { ScriptPreset } from '@/types/GameScript/GameScriptTypes'
import execute from './execute'

const plugin: ScriptPreset = {
  id: 'WinnerGroup',
  key: 'WinnerGroup',
  name: 'WinnerGroup',
  description: '複数の当選者をまとめて返すスクリプト',
  createdAt: '2025/01/01 00:00',
  updatedAt: '2025/01/01 00:00',
  accessLevel: 'basic',
  order: 0,
  editorColor: '#444444',
  version: '1.0.0',
  author: 'Pintocuru',
  tags: ['winner', 'group'],
  url: '',
  banner: '',
  execute,
}

export default plugin
