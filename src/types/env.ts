// src/types/env.ts

/**
 * image パスディレクトリ
 */
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || './Characters/'
export const getImagePath = (profileImage?: string) => {
  return profileImage ? `${imageBaseUrl}${profileImage}` : ''
}

/**
 * developer mode
 */
export const isDev = import.meta.env?.VITE_IS_DEV === 'true'

/**
 * プラグイン
 */
export const PLUGIN_KEY = 'OmikujiBotPluginPlus'
export const PLUGIN_NAME = 'おみくじBOTプラグイン+'
export const SERVER_PLUGIN_URL = `http://localhost:11180/api/plugins/${PLUGIN_KEY}`
export const SERVER_EXPRESS_URL = 'http://localhost:3001/api'
