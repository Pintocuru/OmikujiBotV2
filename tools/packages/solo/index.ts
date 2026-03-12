// tools/packages/solo/index.ts
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import percent_DoraProject from './5percent_Dora'
import BigBangFortuneProject from './BigBangFortune'
import BomberSpinProject from './BomberSpin'
import CardStationProject from './CardStation'
import GouseiSuikaProject from './GouseiSuika'
import HondaJankenProject from './HondaJanken'
import LenormandOracleProject from './LenormandOracle'
import RunicOracleProject from './RunicOracle'
import TarotCardProject from './TarotCard'
import ValentineCoupling from './ValentineCoupling'
import MaidenOmikujiNormalProject from './MaidenOmikujiNormal'
import FlowerFortuneProject from './FlowerFortune'
import MyNineViewersProject from './MyNineViewers'
import GraduationIconsProject from './GraduationIcons'
import StreamCounterCircleProject from './StreamCounterCircle'
import StreamCounterPixelProject from './StreamCounterPixel'

function projects(packageRoot: string): ProjectConfig[] {
  return [
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
    MaidenOmikujiNormalProject(packageRoot),
    FlowerFortuneProject(packageRoot),
    ...MyNineViewersProject.getProjects(packageRoot),
    ...GraduationIconsProject.getProjects(packageRoot),
    ...StreamCounterCircleProject.getProjects(packageRoot),
    ...StreamCounterPixelProject.getProjects(packageRoot),
  ]
}

const targets: PackageBuildTarget[] = [
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
  { project: 'MaidenOmikujiNormal', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'FlowerFortune', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
     ...MyNineViewersProject.buildTargets,
  ...GraduationIconsProject.buildTargets,
  ...StreamCounterCircleProject.buildTargets,
  ...StreamCounterPixelProject.buildTargets,
   */
  // ...StreamCounterCircleProject.buildTargets,
  // ...StreamCounterPixelProject.buildTargets,
]

export default {
  projects,
  targets,
}
