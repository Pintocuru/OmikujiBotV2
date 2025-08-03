// src/main.ts
import {
 GameParams,
 GamePlaceholder,
 GameSettings,
 params,
 placeholders,
 settings
} from './params';
import execute from './execute';
import packageJson from '../package.json';
import { ScriptPreset } from '@shared/types/GameScriptTypes';

const plugin: ScriptPreset<GameSettings, GameParams, GamePlaceholder> = {
 id: packageJson.name, // プラグインID
 name: packageJson.displayName, // プラグイン名
 description: packageJson.description,
 order: 0,
 editorColor: '#333333',
 version: packageJson.version, // バージョン
 author: packageJson.author, // 作者
 tags: packageJson.keywords, // タグ
 url: '', // URL
 execute,
 settings,
 params,
 placeholders,
 componentConfig: {
  rankingTitle: '💣 Bomber Slot Rankings 💥',
  themeName: 'caveMining',
  useRankingBackgrounds: true
 }
};

export default plugin;
