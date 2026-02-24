// server/core/types.ts
export interface FileItem {
  name: string
  modified: string
}

// 共通の結果型
export interface HandlerResult {
  code: number
  data: any
}

export interface RouteResult {
  code: number
  data: any
}
