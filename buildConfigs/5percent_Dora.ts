// buildConfigs/5percent_Dora.ts
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

const doraProject: ProjectConfig = {
  ...commonBuildConfig,

  name: '5percent_Dora',
  version: 'v2025.8.30',
  tags: [
    'おみくじBOT',
    'ドラちゃん',
    '#よくやった青狸',
    '#話が違うぞ青狸',
    'https://www.tv-asahi.co.jp/doraemon/tool/',
  ],
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
    basic: '個人利用のみ',
  },

  template: {
    name: 'どこでもドラちゃんBot',
    boothURL: 'https://pintocuru.booth.pm/items/7291931',
    readmeURL: 'https://github.com/Pintocuru/OmikenReadme/blob/main/docs/OmikujiBot5percent_Dora/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  json: {
    ...commonBuildConfig.json,
    jsonPath: '5percent_Dora.json',
  },

  accessLevels: {
    basic: {
      filesToCopy: [
        { from: 'assets/config.js', to: 'config.js' },
        { from: 'assets/exported/thumb/5percent_Dora.gif', to: 'thumb.gif' },
        { from: 'assets/exported/Characters/5percent_Dora/', to: 'Characters/5percent_Dora/' },
      ],
    },
  },
}

export default doraProject
