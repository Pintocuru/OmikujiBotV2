// tools/packages/solo/LenormandOracle.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'LenormandOracle',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', '占い', 'Fortune', 'ルノルマンカード', 'Lenormand'],

    template: {
      name: 'おみくじ BOT ルノルマンカード OmikujiBot LenormandOracle',
      boothURL: 'https://pintocuru.booth.pm/items/7915987',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/LenormandOracle/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'LenormandOracle.json',
    },

    // アクセスレベル別設定
    license: {
      adv: '利用規約に従う',
    },
    accessLevels: {
      adv: {
        filesToCopy: [{ from: 'assets/thumb/thumb_LenormandOracle.gif', to: 'thumb.gif' }],
      },
    },
  }
}

export default project
