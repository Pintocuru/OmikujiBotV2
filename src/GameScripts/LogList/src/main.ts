// src/main.ts
import {
 GameParams,
 GamePlaceholder,
 GameSettings,
 GameStateExtras,
 params,
 placeholders,
 settings,
 UserRankingType
} from './params';
import execute from './execute';
import packageJson from '../package.json';
import { ScriptPreset } from '@shared/types/GameScriptTypes';

const plugin: ScriptPreset<
 GameSettings,
 GameParams,
 GamePlaceholder,
 UserRankingType,
 GameStateExtras
> = {
 id: packageJson.name, // プラグインID
 name: packageJson.name, // プラグイン名
 description: packageJson.description,
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
