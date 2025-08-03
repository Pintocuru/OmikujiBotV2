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
import { ScriptPreset } from '@type/index';

const plugin: ScriptPreset<GameSettings, GameParams, GamePlaceholder> = {
 id: packageJson.name, // プラグインID
 name: packageJson.name, // プラグイン名
 description: packageJson.description,
 order: 0,
 editorColor: '',
 version: packageJson.version, // バージョン
 author: packageJson.author, // 作者
 tags: packageJson.keywords, // タグ
 url: '', // URL
 banner: '', // バナー画像
 execute,
 settings,
 params,
 placeholders,
 component: null
};

export default plugin;
