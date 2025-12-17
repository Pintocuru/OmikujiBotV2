// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\common\GameScripts\parseQueryString.ts

// クエリをパラメータの形に変換する
export function parseQueryString(queryString: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(queryString))
}
