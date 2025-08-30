// buildConfigs/ReimuMarisa.ts
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

/**
 * ReimuMarisaプロジェクト設定
 */
const reimuMarisaProject: ProjectConfig = {
  ...commonBuildConfig,

  name: 'ReimuMarisa',
  version: 'v2025.8.30(プレビュー版)',
  tags: ['おみくじBOT', 'おみくじ', '占い', 'ゆっくり', 'ゆっくり霊夢', 'ゆっくり魔理沙', 'じゃんけん'],
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
    name: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa',
    boothURL: 'https://pintocuru.booth.pm/items/5471598',
    readmeURL: 'https://github.com/Pintocuru/OmikenReadme/blob/main/docs/OmikujiBotReimuMarisa/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  json: {
    ...commonBuildConfig.json,
    jsonPath: 'ReimuMarisa.json',
  },

  // アクセスレベル別設定
  accessLevels: {
    basic: {
      filesToCopy: [
        { from: 'assets/config.js', to: 'config.js' },
        { from: 'assets/exported/thumb/ReimuMarisa.png', to: 'thumb.png' },
        { from: 'assets/exported/Characters/reimu/', to: 'Characters/reimu/' },
        { from: 'assets/exported/Characters/marisa/', to: 'Characters/marisa/' },
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

export default reimuMarisaProject
