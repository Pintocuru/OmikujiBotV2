// src/types/availableComponents.ts
//
import { AvailableComponentsType } from './DisplaySettingsSchema';

export const availableComponents: AvailableComponentsType = [
 {
  id: 'omikujiBot', // 任意のid
  name: 'おみくじBOT', //
  componentType: 'omikujiBot', // コンポーネント名
  componentKey: null, // コンポーネントの種類
  enabled: true // 有効・
 },
 {
  id: 'BomberSpin', // 任意のid
  name: 'ボンバースロット', //
  componentType: 'GameScripts', // コンポーネント名
  componentKey: 'BomberSpin', // コンポーネントの種類
  enabled: false // 有効・
 },
 {
  id: 'GouseiSuika', // 任意のid
  name: 'スイカジェネレーター', //
  componentType: 'GameScripts', // コンポーネント名
  componentKey: 'GouseiSuika', // コンポーネントの種類
  enabled: false // 有効・
 },
 {
  id: 'DwarfBomb', // 任意のid
  name: 'うさぎスロット', //
  componentType: 'GameScripts', // コンポーネント名
  componentKey: 'DwarfBomb', // コンポーネントの種類
  enabled: false // 有効・
 }
] as const;
