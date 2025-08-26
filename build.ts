// build.ts
import { WebpackBuilder } from '@shared/utils/webpackBuild/buildMain'
import { BuildTarget, SystemCommonData } from '@shared/utils/webpackBuild/buildTypes'
import { alias } from './vite.config'
import packageJson from './package.json'
import { createShimsVue } from './tools/CreateOmikujiData'

// 各設定ファイルをインポート
import reimuMarisaProject from './buildConfigs/ReimuMarisa'
import percent_DoraProject from './buildConfigs/5percent_Dora'

/**
 * ビルド設定リスト
 */
const buildTargets: BuildTarget[] = [
  { project: 'ReimuMarisa', accessLevels: ['basic', 'pro'] }, // ReimuMarisa
  //  { project: '5percent_Dora', accessLevels: ['basic'] }, // 5percent_Dora
]

/**
 * ビルド実行
 */
;(async () => {
  try {
    // 前処理:shims-vue.d.ts を生成
    createShimsVue()

    // メインビルド処理
    const systemCommonData: SystemCommonData = {
      alias,
      author: packageJson.author,
      description: packageJson.description,
      generatorName: packageJson.name,
      generatorVersion: packageJson.version,
    }
    const builder = new WebpackBuilder(systemCommonData)

    // 新しいバージョンができた場合、ここに記載すること
    builder.registerProject(reimuMarisaProject)
    builder.registerProject(percent_DoraProject)

    // ビルド
    await builder.buildTargets(buildTargets)

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
