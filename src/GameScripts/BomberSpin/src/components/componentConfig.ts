// components/componentConfig.ts
import { DisplaySize } from '@shared/types/GameComponentSchema';
import { SizeConfig } from '@shared/utils/rankComponent/useComponentConfig';

// 現在は空です
export const SIZE_CONFIG: Record<DisplaySize, SizeConfig> = {
 xs: {
  explosionText: 'text-[8rem]',
  text: {
   large: 'text-base',
   xlarge: 'text-2xl',
   medium: 'text-sm',
   small: 'text-[8px]'
  },
  rankingNumber: 'w-4 h-3 leading-3 text-[10px]'
 },
 sm: {
  explosionText: 'text-[10rem]',
  text: {
   large: 'text-lg',
   xlarge: 'text-3xl',
   medium: 'text-base',
   small: 'text-[10px]'
  },
  rankingNumber: 'w-5 h-3.5 leading-3.5 text-xs'
 },
 md: {
  explosionText: 'text-[12rem]',
  text: {
   large: 'text-xl',
   xlarge: 'text-4xl',
   medium: 'text-lg',
   small: 'text-xs'
  },
  rankingNumber: 'w-6 h-4 leading-4 text-sm'
 },
 lg: {
  explosionText: 'text-[14rem]',
  text: {
   large: 'text-2xl',
   xlarge: 'text-5xl',
   medium: 'text-xl',
   small: 'text-sm'
  },
  rankingNumber: 'w-8 h-6 leading-6 text-md'
 },
 xl: {
  explosionText: 'text-[16rem]',
  text: {
   large: 'text-3xl',
   xlarge: 'text-6xl',
   medium: 'text-2xl',
   small: 'text-base'
  },
  rankingNumber: 'w-10 h-8 leading-8 text-md'
 }
} as const;
