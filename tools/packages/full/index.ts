// tools/packages/full/index.ts
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import DivaMetanProject from './DivaMetan'
import EveryoneZundaProject from './EveryoneZunda'
import ReimuMarisaProject from './ReimuMarisa'
import TossedKotaroProject from './TossedKotaro'
import TsumugiHimariProject from './TsumugiHimari'

function projects(packageRoot: string): ProjectConfig[] {
  return [
    ReimuMarisaProject(packageRoot),
    EveryoneZundaProject(packageRoot),
    DivaMetanProject(packageRoot),
    TsumugiHimariProject(packageRoot),
    TossedKotaroProject(packageRoot),
  ]
}

const targets: PackageBuildTarget[] = [
  /**
  { project: 'ReimuMarisa', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'ReimuMarisa', type: 'JSON', accessLevel: 'basic' },
  { project: 'EveryoneZunda', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'EveryoneZunda', type: 'JSON', accessLevel: 'basic' },
  { project: 'DivaMetan', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'DivaMetan', type: 'JSON', accessLevel: 'basic' },
  { project: 'TsumugiHimari', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'TsumugiHimari', type: 'JSON', accessLevel: 'basic' },
   */
]

export default {
  projects,
  targets,
}
