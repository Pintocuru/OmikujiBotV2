// [packages] vite.config.ts
import parentConfig from '../../vite.config'; // 親の config ファイル
import { defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { exec } from 'child_process';

const currentDir = path.basename(__dirname); // 現在のディレクトリ名を取得

export default defineConfig(
 mergeConfig(parentConfig, {
  resolve: {
   alias: {
    '@public': path.resolve(__dirname, '../../public'),
    '@': path.resolve(__dirname, './src'),
    '@packages': path.resolve(__dirname, '..'),
    '@LogRank': path.resolve(__dirname, '../LogRank/src')
   }
  },
  build: {
   outDir: './dist/', // 子の出力ディレクトリ
   lib: {
    entry: './src/main.ts', // 子のエントリーファイル
    fileName: `${currentDir}`, // 出力ファイル名
    formats: ['es'] // ESモジュール形式
   }
  },
  plugins: [
   vue(),
   {
    name: 'generate-types',
    buildStart() {
     exec('tsc --declaration --emitDeclarationOnly --outDir types', (err, stdout, stderr) => {
      if (err) {
       console.error('型定義生成エラー:', err);
      } else {
       console.log(stdout || stderr);
      }
     });
    }
   }
  ]
 })
);
