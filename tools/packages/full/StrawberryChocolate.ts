// tools\packages\full\StrawberryChocolate.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/config/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * ReimuMarisaプロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'StrawberryChocolate',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', 'ストロベリーショコラ', '占い', 'じゃんけん'],
    /**
     * CC-BY 4.0 (表示) : 表示義務 再配布OK ライセンス変更OK
     * 利用規約に従う
     * 個人利用のみ
     */
    license: {
      basic: 'CC-BY 4.0',
      pro: 'CC-BY 4.0',
    },

    template: {
      name: 'おみくじBOT ストロベリーショコラ OmikujiBot StrawberryChocolate',
      boothURL: 'https://pintocuru.booth.pm/items/7733810',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/full/StrawberryChocolate/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'StrawberryChocolate.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [
          { from: 'assets/config.js', to: 'config.js' },
          { from: 'assets/exported/thumb/thumb_StrawberryChocolate.gif', to: 'thumb.gif' },
          { from: 'assets/exported/Characters/chocolate/', to: 'Characters/chocolate/' },
        ],
        skipWebpack: false,
        outputJson: false,
      },
      pro: {
        filesToCopy: [
          { from: 'assets/config.js', to: 'config.js' },
          { from: 'assets/exported/thumb/thumb_StrawberryChocolate.gif', to: 'thumb.gif' },
          { from: 'assets/exported/Characters/chocolate/', to: 'Characters/chocolate/' },
        ],
        skipWebpack: false,
        outputJson: false,
      },
    },
  }
}

export default project
