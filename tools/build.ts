// build.ts - 改良版
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { alias } from '../vite.config'
import { CreateShimsVue } from '@shared/utils/webpackBuild/utils/CreateShimsVue'
import { WebpackBuilder } from '@shared/utils/webpackBuild/WebpackBuilder'
import { BuildTarget, SystemCommonData } from '@shared/utils/webpackBuild/buildTypes'

// 各設定ファイルをインポート
import OmikujiBotProject from './packages/OmikujiBot'
import ReimuMarisaProject from './packages/full/ReimuMarisa'
import ReimuMarisaMateProject from './packages/full/ReimuMarisaMate'
import EveryoneZundaProject from './packages/full/EveryoneZunda'
import DivaMetanProject from './packages/full/DivaMetan'

import percent_DoraProject from './packages/solo/5percent_Dora'
import HondaJankenProject from './packages/solo/HondaJanken'
import CardStationProject from './packages/solo/CardStation'
import TarotCardProject from './packages/solo/TarotCard'
import BigBangFortuneProject from './packages/solo/BigBangFortune'

import { APP_VERSION, DATA_VERSION } from '@/config/version'

// .env からrootを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * ビルド設定リスト - プロジェクトタイプを明示的に指定
 */
const buildTargets: BuildTarget[] = [
  /**
   * core - 常にWebpackビルドが必要
   */
  // { project: 'OmikujiBot', type: 'CORE', accessLevel: 'basic' },
  { project: 'OmikujiBot', type: 'CORE', accessLevel: 'basic' },
  /**
   * full
  { project: 'ReimuMarisa', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'ReimuMarisa', type: 'JSON', accessLevel: 'basic' },
  { project: 'ReimuMarisa', type: 'PATCH', accessLevel: 'pro' },
  { project: 'ReimuMarisaMate', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'ReimuMarisaMate', type: 'JSON', accessLevel: 'basic' },
  { project: 'ReimuMarisaMate', type: 'PATCH', accessLevel: 'pro' },
  { project: 'EveryoneZunda', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'EveryoneZunda', type: 'JSON', accessLevel: 'basic' },
  { project: 'EveryoneZunda', type: 'PATCH', accessLevel: 'pro' },
  { project: 'DivaMetan', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'DivaMetan', type: 'JSON', accessLevel: 'basic' },
  { project: 'DivaMetan', type: 'PATCH', accessLevel: 'pro' },
   */

  /**
   * solo
  { project: '5percent_Dora', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'HondaJanken', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'HondaJanken', type: 'JSON', accessLevel: 'basic' },
  { project: 'CardStation', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'CardStation', type: 'JSON', accessLevel: 'basic',},
  { project: 'TarotCard', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'TarotCard', type: 'JSON', accessLevel: 'basic' },
  { project: 'BigBangFortune', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'BigBangFortune', type: 'JSON', accessLevel: 'basic' },
   */
  { project: 'BigBangFortune', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'BigBangFortune', type: 'JSON', accessLevel: 'basic' },
]

/**
 * ビルド実行
 */
;(async () => {
  try {
    // 前処理:shims-vue.d.ts を生成
    CreateShimsVue(packageRoot)

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

    // プロジェクト登録
    builder.registerProject([
      OmikujiBotProject(packageRoot),
      ReimuMarisaProject(packageRoot),
      ReimuMarisaMateProject(packageRoot),
      EveryoneZundaProject(packageRoot),
      DivaMetanProject(packageRoot),
      percent_DoraProject(packageRoot),
      HondaJankenProject(packageRoot),
      CardStationProject(packageRoot),
      TarotCardProject(packageRoot),
      BigBangFortuneProject(packageRoot),
    ])

    // 改良されたビルドを実行
    await builder.buildTargets(buildTargets)

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
