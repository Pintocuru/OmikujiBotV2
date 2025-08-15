// src\types\env.ts

// 開発版・本番で値が異なるもの
export const isDev = import.meta.env?.VITE_IS_DEV || false

// ファイルパスディレクトリ
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || './Characters/'
export const getImagePath = (profileImage?: string) => {
  return profileImage ? `${imageBaseUrl}${profileImage}` : ''
}
