// build.ts
import { APP_VERSION, DATA_VERSION } from '@/version'

import { CoreBuildTarget, PackageBuildTarget, SystemCommonData } from '@shared/utils/webpackBuild/BuildTypes'
import { CreateShimsVue } from '@shared/utils/webpackBuild/utils/CreateShimsVue'
import { WebpackBuilder } from '@shared/utils/webpackBuild/WebpackBuilder'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { alias } from '../vite.config'

// 各設定ファイルをインポート
import OmikujiBotProject from './packages/OmikujiBot'
import OmikujiBotMainProject from './packages/OmikujiBotMain'

// sesupin
import OmikujiBotSpecialProject from './packages/full/OmikujiBotSpecial'
import StrawberryChocolateProject from './packages/full/StrawberryChocolate'

// full
import DivaMetanProject from './packages/full/DivaMetan'
import EveryoneZundaProject from './packages/full/EveryoneZunda'
import ReimuMarisaProject from './packages/full/ReimuMarisa'
import TossedKotaroProject from './packages/full/TossedKotaro'
import TsumugiHimariProject from './packages/full/TsumugiHimari'

// solo
import percent_DoraProject from './packages/solo/5percent_Dora'
import BigBangFortuneProject from './packages/solo/BigBangFortune'
import BomberSpinProject from './packages/solo/BomberSpin'
import CardStationProject from './packages/solo/CardStation'
import GouseiSuikaProject from './packages/solo/GouseiSuika'
import HondaJankenProject from './packages/solo/HondaJanken'
import LenormandOracleProject from './packages/solo/LenormandOracle'
import RunicOracleProject from './packages/solo/RunicOracle'
import TarotCardProject from './packages/solo/TarotCard'
import ValentineCoupling from './packages/solo/ValentineCoupling'

// petit
import HonjoFoxProject from './packages/petit/HonjoFox'
import BreakingSyokenProject from './packages/petit/BreakingSyoken'

// .env からrootを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
const coreBuildTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
  { project: 'OmikujiBotMain' }, // MainGenerator のみ
]

/**
 * ビルド設定リスト - プロジェクトタイプを明示的に指定
 */
const packageBuildTargets: PackageBuildTarget[] = [
  /**
   * Special (せすぴん用)
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'JSON', accessLevel: 'basic' },
  { project: 'OmikujiBotSpecial', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  */
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
  /**
   * full
  { project: 'ReimuMarisa', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'ReimuMarisa', type: 'JSON', accessLevel: 'basic' },
  { project: 'EveryoneZunda', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'EveryoneZunda', type: 'JSON', accessLevel: 'basic' },
  { project: 'DivaMetan', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'DivaMetan', type: 'JSON', accessLevel: 'basic' },
  { project: 'TsumugiHimari', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'TsumugiHimari', type: 'JSON', accessLevel: 'basic' },
   */
  /**
   * solo
  { project: 'BomberSpin', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'GouseiSuika', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'BomberSpin', type: 'JSON', accessLevel: 'basic', },
  { project: 'GouseiSuika', type: 'JSON', accessLevel: 'basic', },
  { project: 'HondaJanken', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'HondaJanken', type: 'JSON', accessLevel: 'basic' },
  { project: 'CardStation', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'CardStation', type: 'JSON', accessLevel: 'basic' },
  { project: 'TarotCard', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'TarotCard', type: 'JSON', accessLevel: 'basic' },
  { project: '5percent_Dora', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'BigBangFortune', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'BigBangFortune', type: 'JSON', accessLevel: 'basic' },
  { project: 'LenormandOracle', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBotMain' },
  { project: 'LenormandOracle', type: 'JSON', accessLevel: 'adv' },
  { project: 'RunicOracle', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBotMain' },
  { project: 'RunicOracle', type: 'JSON', accessLevel: 'adv' },
   */
  /**
   * petit
  { project: 'HonjoFox', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'HonjoFox', type: 'JSON', accessLevel: 'basic' },
   */
  { project: 'BreakingSyoken', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyoken', type: 'JSON', accessLevel: 'basic' },
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
      // Core
      OmikujiBotProject(packageRoot),
      OmikujiBotMainProject(packageRoot),

      // sesupin
      StrawberryChocolateProject(packageRoot),
      OmikujiBotSpecialProject(packageRoot),

      // Full
      ReimuMarisaProject(packageRoot),
      EveryoneZundaProject(packageRoot),
      DivaMetanProject(packageRoot),
      TsumugiHimariProject(packageRoot),
      TossedKotaroProject(packageRoot),

      // solo
      BomberSpinProject(packageRoot),
      GouseiSuikaProject(packageRoot),
      percent_DoraProject(packageRoot),
      HondaJankenProject(packageRoot),
      CardStationProject(packageRoot),
      TarotCardProject(packageRoot),
      LenormandOracleProject(packageRoot),
      RunicOracleProject(packageRoot),
      BigBangFortuneProject(packageRoot),
      ValentineCoupling(packageRoot),

      // petit
      HonjoFoxProject(packageRoot),
      BreakingSyokenProject(packageRoot),
    ])

    // 改良されたビルドを実行
    await builder.build({
      coreTargets: coreBuildTargets,
      packageTargets: packageBuildTargets,
    })

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
