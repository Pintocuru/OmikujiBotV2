// [Package] eslint.config.mjs - ESLint v9対応版
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginImport from 'eslint-plugin-import'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM環境での__dirnameの取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 環境変数からチェックレベルを取得
const checkLevel = process.env.VITE_TS_CHECK_LEVEL || 'development'

// チェックレベルに応じたルール設定
function getRulesForLevel(level) {
  const baseRules = {
    // 全レベル共通
    'vue/multi-word-component-names': 0,
  }

  switch (level) {
    case 'development':
      return {
        ...baseRules,
        // 1. 循環参照のみチェック、他は緩い設定
        'import/no-cycle': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/prefer-const': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'vue/no-unused-vars': 'off',
      }

    case 'beta':
      return {
        ...baseRules,
        // 2. 型エラーは厳格、anyは許容
        'import/no-cycle': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'off', // anyは許容
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/prefer-const': 'warn',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        'vue/no-unused-vars': 'warn',
      }

    case 'production':
      return {
        ...baseRules,
        // 3. 最も厳格な設定
        'import/no-cycle': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/prefer-const': 'error',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/restrict-template-expressions': 'error',
        'vue/no-unused-vars': 'error',
        'vue/require-v-for-key': 'error',
        'vue/no-unused-components': 'error',
      }

    default:
      return baseRules
  }
}

console.log(`🔍 ESLint Check Level: ${checkLevel}`)

export default [
  {
    // 対象ファイルの指定
    name: 'app/files-to-lint',
    files: ['**/*.{ts,js,mts,tsx,vue}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: path.resolve(__dirname),
      },
    },
  },
  {
    // 除外対象（ビルド後のファイルなど）
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // Vue の基本的なルールセット（Flat Config用）
  ...pluginVue.configs['flat/essential'],

  // Import plugin の設定
  {
    name: 'import-plugin-config',
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // TypeScript用の設定をマージ
  ...vueTsEslintConfig(),

  {
    // チェックレベルに応じたルール設定
    name: `app/level-${checkLevel}-rules`,
    rules: getRulesForLevel(checkLevel),
  },

  // Prettier に整形を任せる設定
  skipFormatting,
]
