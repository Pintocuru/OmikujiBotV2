// tools/packages/petit/index.ts
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import HonjoFoxProject from './HonjoFox'
import BreakingSyokenProject from './BreakingSyoken'

function projects(packageRoot: string): ProjectConfig[] {
  return [HonjoFoxProject(packageRoot), BreakingSyokenProject(packageRoot)]
}

const targets: PackageBuildTarget[] = [
  /**
   * petit
  { project: 'HonjoFox', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'HonjoFox', type: 'JSON', accessLevel: 'basic' },
  { project: 'BreakingSyoken', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyoken', type: 'JSON', accessLevel: 'basic' },
   */
]

export default {
  projects,
  targets,
}
