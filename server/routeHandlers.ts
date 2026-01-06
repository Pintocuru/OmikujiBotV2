// server/routeHandlers.ts（Expressアダプター）
import { Request, Response } from 'express'
import * as handlers from './handlers/commonHandlers'

async function sendHandlerResult(res: Response, handlerFn: () => Promise<{ code: number; data: any }>): Promise<void> {
  const result = await handlerFn()
  res.status(result.code).json(result.data)
}

export async function handleListFiles(req: Request, res: Response): Promise<void> {
  await sendHandlerResult(res, handlers.listFilesHandler)
}

export async function handleSaveFile(req: Request, res: Response): Promise<void> {
  const { fileName, data } = req.body
  await sendHandlerResult(res, () => handlers.saveFileHandler(fileName, data))
}

export async function handleSaveOmikuji(req: Request, res: Response): Promise<void> {
  const { configData } = req.body
  await sendHandlerResult(res, () => handlers.saveOmikujiHandler(configData))
}

export async function handleLoadFile(req: Request, res: Response): Promise<void> {
  const { fileName } = req.params
  await sendHandlerResult(res, () => handlers.loadFileHandler(fileName))
}

export async function handleDeleteFile(req: Request, res: Response): Promise<void> {
  const { fileName } = req.params
  await sendHandlerResult(res, () => handlers.deleteFileHandler(fileName))
}

export function handleHealthCheck(req: Request, res: Response): void {
  const result = handlers.healthCheckHandler()
  res.status(result.code).json(result.data)
}
