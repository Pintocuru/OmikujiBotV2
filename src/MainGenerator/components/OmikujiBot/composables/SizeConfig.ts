// src\MainGenerator\components\OmikujiBot\composables\SizeConfig.ts

// サイズ設定の定数
export const SIZE_CONFIG = {
  xs: { text: 'text-sm', avatar: 'w-24 h-24', avatarTop: '300px', spacing: 20 },
  sm: { text: 'text-md', avatar: 'w-32 h-32', avatarTop: '380px', spacing: 20 },
  md: { text: 'text-lg', avatar: 'w-48 h-48', avatarTop: '440px', spacing: 40 },
  lg: { text: 'text-xl', avatar: 'w-64 h-64', avatarTop: '560px', spacing: 60 },
  xl: { text: 'text-2xl', avatar: 'w-80 h-80', avatarTop: '640px', spacing: 80 },
} as const
