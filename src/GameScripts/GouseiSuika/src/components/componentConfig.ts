// components/componentConfig.ts

export const SIZE_CONFIG = {
 xs: {
  scoreCircle: 'w-32 h-32',
  text: {
   large: 'text-base',
   xlarge: 'text-2xl',
   medium: 'text-sm',
   small: 'text-[8px]'
  },
  rankingImage: 'w-4 h-4',
  rankingNumber: 'w-4 h-3 leading-3 text-[8px]',
  container: {
   padding: 'py-0',
   itemPadding: 'py-0'
  }
 },
 sm: {
  scoreCircle: 'w-40 h-40',
  text: {
   large: 'text-lg',
   xlarge: 'text-3xl',
   medium: 'text-base',
   small: 'text-[10px]'
  },
  rankingImage: 'w-5 h-5',
  rankingNumber: 'w-5 h-3.5 leading-3.5 text-[10px]',
  container: {
   padding: 'py-0.5',
   itemPadding: 'py-0'
  }
 },
 md: {
  scoreCircle: 'w-48 h-48',
  text: {
   large: 'text-xl',
   xlarge: 'text-4xl',
   medium: 'text-lg',
   small: 'text-xs'
  },
  rankingImage: 'w-6 h-6',
  rankingNumber: 'w-6 h-4 leading-4 text-xs',
  container: {
   padding: 'py-1',
   itemPadding: 'py-0.5'
  }
 },
 lg: {
  scoreCircle: 'w-56 h-56',
  text: {
   large: 'text-2xl',
   xlarge: 'text-5xl',
   medium: 'text-xl',
   small: 'text-sm'
  },
  rankingImage: 'w-8 h-8',
  rankingNumber: 'w-8 h-6 leading-6 text-xs',
  container: {
   padding: 'py-2',
   itemPadding: 'py-1'
  }
 },
 xl: {
  scoreCircle: 'w-64 h-64',
  text: {
   large: 'text-3xl',
   xlarge: 'text-6xl',
   medium: 'text-2xl',
   small: 'text-base'
  },
  rankingImage: 'w-10 h-10',
  rankingNumber: 'w-10 h-8 leading-8 text-sm',
  container: {
   padding: 'py-3',
   itemPadding: 'py-1.5'
  }
 }
} as const;
