// src/version.ts
import package_json from '../package.json'

// アプリケーションのバージョン情報
export const BUILD_DATE = buildDate()
export const APP_VERSION = package_json.version
export const DATA_VERSION = package_json.data_version

function buildDate(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}
