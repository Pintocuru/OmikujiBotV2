// tools/packages/sesupin/index.ts
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import OmikujiBotSpecialProject from './OmikujiBotSpecial'
import StrawberryChocolate from './StrawberryChocolate'

function projects(packageRoot: string): ProjectConfig[] {
  return [...StrawberryChocolate.getProjects(packageRoot), OmikujiBotSpecialProject(packageRoot)]
}

const targets: PackageBuildTarget[] = [
  /**
   * Special (せすぴん用)
  { project: 'OmikujiBotSpecial', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  ...StrawberryChocolate.buildTargets, 
   */
  ...StrawberryChocolate.buildTargets,
]

export default {
  projects,
  targets,
}
