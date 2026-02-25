//
import OmikujiBotProject from './OmikujiBot'
import OmikujiBotMainProject from './OmikujiBotMain'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

export function getCoreProjects(packageRoot: string): ProjectConfig[] {
  return [OmikujiBotProject(packageRoot), OmikujiBotMainProject(packageRoot)]
}
