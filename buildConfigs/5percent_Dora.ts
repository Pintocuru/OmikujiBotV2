// buildConfigs/5percent_Dora.ts (新形式)
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

const doraProject: ProjectConfig = {
  ...commonBuildConfig,

  name: '5percent_Dora',
  version: 'v2025.8.16',

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
