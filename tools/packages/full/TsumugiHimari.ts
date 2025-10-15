// tools\packages\full\TsumugiHimari.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/config/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'TsumugiHimari',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', 'VOICEVOX', '春日部つむぎ', '冥鳴ひまり'],
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
      pro: '利用規約に従う',
    },

    template: {
      name: 'おみくじ BOT ズッ友!つむぎ&ひまり ネットミームマシマシ ver OmikujiBot Tsumugi Himari',
      boothURL: 'https://pintocuru.booth.pm/items/7530206',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/full/TsumugiHimari/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'TsumugiHimari.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [
          { from: 'assets/config.js', to: 'config.js' },
          { from: 'assets/exported/thumb/thumb_TsumugiHimari.gif', to: 'thumb.gif' },
          { from: 'assets/exported/Characters/tsumugi/', to: 'Characters/tsumugi/' },
          { from: 'assets/exported/Characters/himari/', to: 'Characters/himari/' },
        ],
        skipWebpack: false,
        outputJson: false,
      },
      pro: {
        filesToCopy: [],
        skipWebpack: true,
        outputJson: true,
      },
    },
  }
}

export default project
