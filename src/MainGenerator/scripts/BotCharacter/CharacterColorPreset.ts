// src\MainGenerator\scripts\BotCharacter\CharacterColorPreset.ts
import { CharacterColorType } from '@/types'

// デフォルトキャラクター用のカラーテーマ（マテリアルカラーベース、濃い背景中心）
export const DEFAULT_COLOR_THEMES: Partial<CharacterColorType>[] = [
  // 1. Red
  {
    nameColor: '#EF5350',
    textColor: '#FFEBEE',
    backgroundColor: '#D32F2F',
  },
  // 2. Red-Orange（創作）
  {
    nameColor: '#FF7043',
    textColor: '#FBE9E7',
    backgroundColor: '#E64A19',
  },
  // 3. Orange
  {
    nameColor: '#FFB74D',
    textColor: '#FFF3E0',
    backgroundColor: '#F57C00',
  },
  // 4. Yellow（創作）
  {
    nameColor: '#FFF176',
    textColor: '#FFFDE7',
    backgroundColor: '#FBC02D',
  },
  // 5. Yellow-Green（Lime）
  {
    nameColor: '#AED581',
    textColor: '#F9FBE7',
    backgroundColor: '#689F38',
  },
  // 6. Green（Forest Green）
  {
    nameColor: '#66BB6A',
    textColor: '#E8F5E8',
    backgroundColor: '#2E7D32',
  },
  // 7. Cyan（Deep Cyan）
  {
    nameColor: '#4DD0E1',
    textColor: '#E0F6FF',
    backgroundColor: '#0097A7',
  },
  // 8. Blue（Deep Blue）
  {
    nameColor: '#64B5F6',
    textColor: '#E3F2FD',
    backgroundColor: '#1565C0',
  },
  // 9. Indigo（Deep Indigo）
  {
    nameColor: '#7986CB',
    textColor: '#E8EAF6',
    backgroundColor: '#303F9F',
  },
  // 10. Violet（Violet）
  {
    nameColor: '#BA68C8',
    textColor: '#F3E5F5',
    backgroundColor: '#8E24AA',
  },
  // 11. Magenta（Deep Pink）
  {
    nameColor: '#F06292',
    textColor: '#FCE4EC',
    backgroundColor: '#C2185B',
  },
  // 12. Brown（Deep Brown）
  {
    nameColor: '#A1887F',
    textColor: '#EFEBE9',
    backgroundColor: '#5D4037',
  },
]
