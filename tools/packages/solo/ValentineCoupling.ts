// tools/packages/solo/ValentineCoupling.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'ValentineCoupling',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', 'リスト表示', 'winner', 'カップル', 'カップリング'],

    license: {
      basic: 'CC-BY 4.0',
    },

    template: {
      name: 'おみくじ BOT バレンタイン・カップリング OmikujiBot ValentineCoupling',
      boothURL: 'https://pintocuru.booth.pm/items/7432682',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/ValentineCoupling/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'ValentineCoupling.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [{ from: 'assets/thumb/thumb_ValentineCoupling.gif', to: 'thumb.gif' }],
      },
    },
  }
}

export default project
