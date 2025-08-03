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
import component from '@/components/component.vue';
import { ScriptPreset } from '@type/index';
import { GameStateExtras, UserRankingType } from '@/GameScripts/LogRank/src/params';

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
 execute,
 settings,
 params,
 placeholders,
 component
};

export default plugin;
