// [packages] vite.config.ts
import { baseViteConfig, rootAlias } from '../../../../../buildRoot/viteConfigBase'; // 親の config ファイル
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const currentDir = path.basename(__dirname); // 現在のディレクトリ名を取得

const base = baseViteConfig(__dirname);

// パッケージのエイリアス
export const alias = {
 ...rootAlias,
 '@': path.resolve(__dirname, 'src')
};

export default defineConfig(
 mergeConfig(base, {
  root: path.resolve(__dirname),
  resolve: { alias },
  build: {
   outDir: './dist/', // 子の出力ディレクトリ
   lib: {
    entry: './src/main.ts', // 子のエントリーファイル
    fileName: `${currentDir}`, // 出力ファイル名
    formats: ['es'] // ESモジュール形式
   }
  }
 })
);
