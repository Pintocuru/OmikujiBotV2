// tools\packages\solo\TarotCard.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'TarotCard',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', 'タロット', 'tarot', 'Fortune'],
    /**
     * CC-BY 4.0 (表示) : 表示義務 再配布OK ライセンス変更OK
     * CC-BY-SA 4.0 (表示-継承) : 継承義務 再配布OK
     * CC-BY-NC 4.0 (表示-非営利) : 表示義務 非営利
     * CC-BY-NC-SA 4.0 (表示-非営利-継承) : 非営利 継承 再配布OK
     * CC-BY-NC-ND 4.0 (表示-非営利-改変禁止)
     * 利用規約に従う
     * 個人利用のみ
     * 商用利用可
     * 改変禁止
     */
    license: {
      basic: 'CC-BY 4.0',
    },

    template: {
      name: 'おみくじ BOT タロットカード OmikujiBot TarotCard',
      boothURL: 'https://pintocuru.booth.pm/items/7432682',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/TarotCard/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'TarotCard.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [{ from: 'assets/exported/thumb/thumb_TarotCard.gif', to: 'thumb.gif' }],
      },
    },
  }
}

export default project
