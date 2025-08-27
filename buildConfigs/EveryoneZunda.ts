// buildConfigs\EveryoneZunda.ts
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

/**
 * プロジェクト設定
 */
const project: ProjectConfig = {
  ...commonBuildConfig,

  name: 'EveryoneZunda',
  version: 'v2025.8.27(プレビュー版)',
  tags: ['おみくじBOT', 'VOICEVOX', 'ずんだもん', '（ず・ω・きょ）'],
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
    name: 'おみくじBOT みんなのずんだもん OmikujiBot EveryoneZunda',
    boothURL: 'https://pintocuru.booth.pm/items/6053855',
    readmeURL: 'https://github.com/Pintocuru/OmikenReadme/blob/main/docs/OmikujiBotEveryoneZunda/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  json: {
    ...commonBuildConfig.json,
    jsonPath: 'EveryoneZunda.json',
  },

  // アクセスレベル別設定
  accessLevels: {
    basic: {
      filesToCopy: [
        { from: 'assets/config.js', to: 'config.js' },
        { from: 'assets/exported/thumb/EveryoneZunda.png', to: 'thumb.png' },
        { from: 'assets/exported/Characters/zunda/', to: 'Characters/zunda/' },
      ],
      skipWebpack: false,
      outputJson: false,
    },
    pro: {
      filesToCopy: [{ from: 'assets/exported/thumb/ReimuMarisaDX.png', to: 'thumb.png' }],
      skipWebpack: true,
      outputJson: true,
    },
  },
}

export default project
