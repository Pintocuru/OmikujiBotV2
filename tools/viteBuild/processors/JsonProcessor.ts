// tools/viteBuild/processors/JsonProcessor.ts
import fs from 'fs'
import path from 'path'
import type { OmikujiDataType } from '@/types/OmikujiData/'
import type { ResolvedPackageBuildConfig } from '../types'

function getAccessSuffix(level: ResolvedPackageBuildConfig['targetAccessLevel']): string {
  switch (level) {
    case 'pro':
      return '-PRO'
    case 'godMode':
      return '-GOD-MODE'
    case 'adv':
      return '-ADV'
    default:
      return ''
  }
}

export async function generateOmikujiData(config: ResolvedPackageBuildConfig, outputDir: string): Promise<void> {
  const jsonConfig = config.json
  if (!jsonConfig) throw new Error(`[Build] JSON config missing: ${config.key}`)

  const sourcePath = path.resolve(jsonConfig.jsonPathRoot, jsonConfig.jsonPath)
  let data: OmikujiDataType
  try {
    data = JSON.parse(fs.readFileSync(sourcePath, 'utf-8')) as OmikujiDataType
  } catch (error) {
    throw new Error(`[Build] Failed to read preset JSON: ${sourcePath}. ${String(error)}`)
  }

  if (data.meta) {
    data = {
      ...data,
      meta: {
        ...data.meta,
        id: `${config.key}-${config.version}`,
        name: `${config.template!.label}${getAccessSuffix(config.targetAccessLevel)}`,
        description: config.template!.description,
        version: config.version,
        author: config.system.author,
        tags: config.tags,
        license: config.licenseLabel || '個人利用のみ',
        url: config.template!.boothURL,
        banner: config.banner,
        generatorName: config.system.generatorName,
        generatorVersion: config.system.generatorVersion,
        dataVersion: config.system.dataVersion,
      },
    }
  }

  if (jsonConfig.assembleJsonData) {
    data = await jsonConfig.assembleJsonData(data, jsonConfig.jsonPathRoot) as OmikujiDataType
  }
  if (jsonConfig.generateAccessLevelData) {
    data = jsonConfig.generateAccessLevelData(data, config.targetAccessLevel) as OmikujiDataType
  }

  const content = jsonConfig.generateJsContent(JSON.stringify(data, null, 2))
  fs.writeFileSync(path.join(outputDir, 'omikujiData.js'), content, 'utf-8')
}
