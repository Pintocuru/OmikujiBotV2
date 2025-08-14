// eslint.config.ts
// 必要なプラグインや設定をインポート
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    // 対象ファイルの指定
    name: 'app/files-to-lint',
    files: ['**/*.{ts,js,mts,tsx,vue}'],
  },
  {
    // 除外対象（ビルド後のファイルなど）
    name: 'app/files-to-ignore',
    ignores: ['public', '**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  // Vue の基本的なルールセット（Flat Config用）
  ...pluginVue.configs['flat/essential'],
  {
    // 独自ルールの追加・上書き
    rules: {
      // 単語名のコンポーネント名の警告を無効化
      'vue/multi-word-component-names': 0,
    },
  },
  // TypeScript用の設定をマージ
  ...vueTsEslintConfig(),
  // Prettier に整形を任せる設定
  skipFormatting,
]
