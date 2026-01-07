// src/MainGenerator/scripts/VariablePlaceholder/PatternMatcher.ts
import { CALC_PATTERN, RAND_PATTERN, RESERVED_KEYS, VAR_DECLARATION_PATTERN } from './ReservedKeys'

/**
 * 変数宣言の型
 */
export interface VariableDeclaration {
  name: string
  value: string
}

/**
 * calc宣言の型
 */
export interface CalcDeclaration {
  name: string
  operator: string
  expression: string
}

/**
 * rand関数の型
 */
export interface RandFunction {
  min: string
  max: string
}

/**
 * プレースホルダーパターンマッチング用ユーティリティクラス
 * VariableProcessor と Vue コンポーネントで共通利用
 */
export class PatternMatcher {
  /**
   * テキスト内の変数宣言を全て抽出
   */
  static extractVariableDeclarations(text: string): VariableDeclaration[] {
    const matches = text.matchAll(VAR_DECLARATION_PATTERN)
    const declarations: VariableDeclaration[] = []

    for (const match of matches) {
      if (match[1] && match[2]) {
        declarations.push({
          name: match[1].trim(),
          value: match[2].trim(),
        })
      }
    }

    return declarations
  }

  /**
   * calc宣言を全て抽出
   */
  static extractCalcDeclarations(text: string): CalcDeclaration[] {
    const matches = text.matchAll(CALC_PATTERN)
    const declarations: CalcDeclaration[] = []

    for (const match of matches) {
      if (match[1] && match[2] && match[3]) {
        declarations.push({
          name: match[1].trim(),
          operator: match[2],
          expression: match[3].trim(),
        })
      }
    }

    return declarations
  }

  /**
   * rand関数を全て抽出
   */
  static extractRandFunctions(text: string): RandFunction[] {
    const matches = text.matchAll(RAND_PATTERN)
    const functions: RandFunction[] = []

    for (const match of matches) {
      if (match[1] && match[2]) {
        functions.push({
          min: match[1],
          max: match[2],
        })
      }
    }

    return functions
  }

  /**
   * 予約語を使った変数宣言をフィルタ
   */
  static filterReservedDeclarations(declarations: VariableDeclaration[]): VariableDeclaration[] {
    return declarations.filter((decl) => RESERVED_KEYS.includes(decl.name))
  }

  /**
   * カスタム変数宣言（予約語以外）をフィルタ
   */
  static filterCustomDeclarations(declarations: VariableDeclaration[]): VariableDeclaration[] {
    return declarations.filter((decl) => !RESERVED_KEYS.includes(decl.name))
  }
}
