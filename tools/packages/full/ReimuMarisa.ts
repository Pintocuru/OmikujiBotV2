// tools/packages/full/ReimuMarisa.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * ReimuMarisaプロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'ReimuMarisa',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', 'おみくじ', '占い', 'ゆっくり', 'ゆっくり霊夢', 'ゆっくり魔理沙', 'じゃんけん'],

    license: {
      basic: 'CC-BY 4.0',
      pro: '利用規約に従う',
    },

    template: {
      name: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa',
      boothURL: 'https://pintocuru.booth.pm/items/5471598',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/full/ReimuMarisa/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'ReimuMarisa.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [
          { from: 'assets/exported/thumb/thumb_ReimuMarisa.gif', to: 'thumb.gif' },
          { from: 'assets/exported/Characters/reimu/', to: 'Characters/reimu/' },
          { from: 'assets/exported/Characters/marisa/', to: 'Characters/marisa/' },
        ],
      },
      pro: {
        filesToCopy: [],
      },
    },
  }
}

export default project
