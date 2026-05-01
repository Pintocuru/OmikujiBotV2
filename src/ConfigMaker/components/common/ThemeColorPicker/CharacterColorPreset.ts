// src/ConfigMaker/components/common/ThemeColorPicker/CharacterColorPreset.ts
import { CharacterColorType } from '@/types'

// デフォルトキャラクター用のカラーテーマ（マテリアルカラーベース、可読性重視）
export const DEFAULT_COLOR_THEMES: Partial<CharacterColorType>[] = [
  // 1. Red - 情熱的で力強い
  {
    nameColor: '#EF9A9A', // Red 200 - 柔らかい赤で視認性向上
    textColor: '#FFFFFF', // 純白で最高のコントラスト
    backgroundColor: '#C62828', // Red 800 - 深い赤
  },
  // 2. Deep Orange - 温かみのあるオレンジ
  {
    nameColor: '#FFAB91', // Deep Orange 200
    textColor: '#FFFFFF',
    backgroundColor: '#D84315', // Deep Orange 800
  },
  // 3. Orange - 明るく親しみやすい
  {
    nameColor: '#FFCC80', // Orange 200
    textColor: '#FFFFFF',
    backgroundColor: '#EF6C00', // Orange 800
  },
  // 4. Amber - 暖色系で落ち着いた印象
  {
    nameColor: '#FFE082', // Amber 200
    textColor: '#212121', // 濃い背景に対しては白、明るい背景には黒
    backgroundColor: '#FF8F00', // Amber 800
  },
  // 5. Lime - 爽やかで活発
  {
    nameColor: '#E6EE9C', // Lime 200
    textColor: '#212121',
    backgroundColor: '#9E9D24', // Lime 800
  },
  // 6. Green - 自然で安定感
  {
    nameColor: '#A5D6A7', // Green 200
    textColor: '#FFFFFF',
    backgroundColor: '#2E7D32', // Green 800
  },
  // 7. Teal - クールで洗練された
  {
    nameColor: '#80CBC4', // Teal 200
    textColor: '#FFFFFF',
    backgroundColor: '#00695C', // Teal 800
  },
  // 8. Light Blue - 爽快で開放的
  {
    nameColor: '#81D4FA', // Light Blue 200
    textColor: '#FFFFFF',
    backgroundColor: '#01579B', // Light Blue 900
  },
  // 9. Indigo - 知的で落ち着いた
  {
    nameColor: '#9FA8DA', // Indigo 200
    textColor: '#FFFFFF',
    backgroundColor: '#283593', // Indigo 800
  },
  // 10. Deep Purple - 高貴で神秘的
  {
    nameColor: '#B39DDB', // Deep Purple 200
    textColor: '#FFFFFF',
    backgroundColor: '#4527A0', // Deep Purple 800
  },
  // 11. Pink - 優しく華やか
  {
    nameColor: '#F48FB1', // Pink 200
    textColor: '#FFFFFF',
    backgroundColor: '#AD1457', // Pink 800
  },
  // 12. Brown - 温もりのある落ち着き
  {
    nameColor: '#BCAAA4', // Brown 200
    textColor: '#FFFFFF',
    backgroundColor: '#4E342E', // Brown 800
  },
]
