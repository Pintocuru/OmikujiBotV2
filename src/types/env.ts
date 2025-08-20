// src\types\env.ts

/**
 * image パスディレクトリ
 */
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || './Characters/'
export const getImagePath = (profileImage?: string) => {
  return profileImage ? `${imageBaseUrl}${profileImage}` : ''
}

/**
 * settingMode
 */

// developer mode
export const isDev = import.meta.env?.VITE_IS_DEV || false
