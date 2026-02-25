// tools/packages/sesupin/index.ts
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import OmikujiBotSpecialProject from './OmikujiBotSpecial'
import StrawberryChocolateProject from './StrawberryChocolate'

function projects(packageRoot: string): ProjectConfig[] {
  return [StrawberryChocolateProject(packageRoot), OmikujiBotSpecialProject(packageRoot)]
}

const targets: PackageBuildTarget[] = [
  /**
   * Special (せすぴん用)
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'JSON', accessLevel: 'basic' },
  { project: 'OmikujiBotSpecial', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  */
]

export default {
  projects,
  targets,
}
