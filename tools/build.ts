// build.ts
import { createShimsVue } from './buildOptions/CreateOmikujiData'
import { alias } from '../vite.config'
import { WebpackBuilder } from '@shared/utils/webpackBuild/WebpackBuilder'
import { BuildTarget, SystemCommonData } from '@shared/utils/webpackBuild/config/buildTypes'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// 各設定ファイルをインポート
import OmikujiBotProject from './packages/OmikujiBot'
import ReimuMarisaProject from './packages/full/ReimuMarisa'
import ReimuMarisaMateProject from './packages/full/ReimuMarisaMate'
import EveryoneZundaProject from './packages/full/EveryoneZunda'
import DivaMetanProject from './packages/full/DivaMetan'
import HondaJankenProject from './packages/solo/HondaJanken'
import percent_DoraProject from './packages/solo/5percent_Dora'
import { APP_VERSION, DATA_VERSION } from '@/config/version'

// .env からrootを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * ビルド設定リスト
 */
const buildTargets: BuildTarget[] = [
  //  { project: 'OmikujiBot', accessLevels: ['basic'] },
  //  { project: 'ReimuMarisa', accessLevels: ['basic', 'basicJson', 'pro'] },
  //{ project: 'ReimuMarisaMate', accessLevels: ['basic', 'basicJson', 'pro'] },
  { project: 'EveryoneZunda', accessLevels: ['basic', 'basicJson', 'pro'] },
  { project: 'DivaMetan', accessLevels: ['basic', 'basicJson', 'pro'] },
  //{ project: 'HondaJanken', accessLevels: ['basic', 'basicJson'] },
  //{ project: '5percent_Dora', accessLevels: ['basic'] },
]

/**
 * ビルド実行
 */
;(async () => {
  try {
    // 前処理:shims-vue.d.ts を生成
    createShimsVue(packageRoot)

    // メインビルド処理
    const systemCommonData: SystemCommonData = {
      alias,
      author: 'Pintocuru(せすじピンとしてます)',
      description: 'おみくじ付きBOTジェネレーター',
      generatorName: 'omikuji-bot',
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    }
    const builder = new WebpackBuilder(systemCommonData)

    // 新しいバージョンができた場合、ここに記載すること
    builder.registerProject(OmikujiBotProject(packageRoot))
    builder.registerProject(ReimuMarisaProject(packageRoot))
    builder.registerProject(ReimuMarisaMateProject(packageRoot))
    builder.registerProject(EveryoneZundaProject(packageRoot))
    builder.registerProject(DivaMetanProject(packageRoot))
    builder.registerProject(HondaJankenProject(packageRoot))
    builder.registerProject(percent_DoraProject(packageRoot))

    // ビルド
    await builder.buildTargets(buildTargets)

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
