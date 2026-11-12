// tools/viteBuild/processors/PostBuildProcessor.ts
import fs from 'fs'
import path from 'path'
import type { AccessLevelType } from '@shared/types'
import type { ResolvedPackageBuildConfig } from '../types'
import { generateOmikujiData } from './JsonProcessor'

function getAccessSuffix(level: AccessLevelType): string {
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

function getLicenseInfo(config: ResolvedPackageBuildConfig): { key: string; label: string } | null {
  switch (config.targetAccessLevel) {
    case 'pro':
      return config.licenseKey?.pro ? { key: config.licenseKey.pro, label: 'PRO' } : null
    case 'godMode':
      return config.licenseKey?.godMode ? { key: config.licenseKey.godMode, label: 'GOD-MODE' } : null
    default:
      return null
  }
}

function generateReadme(config: ResolvedPackageBuildConfig, outputDir: string): void {
  const template = config.template!
  const packageName = `${template.name}${getAccessSuffix(config.targetAccessLevel)} ${config.version}`
  const license = getLicenseInfo(config)
  const licenseSection = license
    ? `\n★★★★★★★★★★★★★★★★★\n\n${license.label}版 ライセンスキーはこちら♡\n\n${license.key}\n\n★★★★★★★★★★★★★★★★★\n`
    : ''

  const content = `# ${packageName}

最終更新日:${formatToday()}

[${packageName}](${template.boothURL})は、${template.description} です。
ダウンロードして頂きありがとうございます。

導入方法・使用方法については[こちら](${template.readmeURL})をご覧ください

${licenseSection}

---
作成者:せすじピンとしてます [@pintocuru](https://twitter.com/pintocuru)
YouTube : [せすじピンとしてます](https://www.youtube.com/@pintocuru)
`

  fs.writeFileSync(path.join(outputDir, 'readme.txt'), content, 'utf-8')
}

function formatToday(): string {
  const now = new Date()
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
}

function generateTemplateJson(config: ResolvedPackageBuildConfig, outputDir: string): void {
  const template = config.template!
  const templateJson = {
    name: `${template.name}${getAccessSuffix(config.targetAccessLevel)} ${config.version}`,
    author: config.system.author,
    link: template.boothURL,
    description: config.system.description,
  }
  fs.writeFileSync(path.join(outputDir, 'template.json'), JSON.stringify(templateJson, null, 2), 'utf-8')
}

export async function processPostBuild(config: ResolvedPackageBuildConfig, outputDir: string): Promise<void> {
  generateReadme(config, outputDir)
  generateTemplateJson(config, outputDir)
  await generateOmikujiData(config, outputDir)
}
