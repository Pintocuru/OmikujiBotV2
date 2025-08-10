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
import { ScriptPreset } from '@/types/';
import { componentConfig } from './componentConfig';

const plugin: ScriptPreset<GameSettings, GameParams, GamePlaceholder> = {
 id: packageJson.name, // プラグインID
 key: packageJson.name,
 name: packageJson.displayName, // プラグイン名
 description: packageJson.description,
 createdAt: '2025/08/10 16:45',
 updatedAt: '2025/08/10 16:45',
 order: 0,
 editorColor: '#333333',
 version: packageJson.version, // バージョン
 author: packageJson.author, // 作者
 tags: packageJson.keywords, // タグ
 url: '', // URL
 banner: '', //
 execute,
 settings,
 params,
 placeholders,
 componentConfig
};

export default plugin;
