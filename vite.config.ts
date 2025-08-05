// vite.config.ts
import { defineConfig, mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { baseViteConfig, rootAlias } from '../../buildRoot/viteConfigBase';
import tsconfig from './tsconfig.json';

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const base = baseViteConfig(__dirname);

// tsconfig.json からエイリアスを生成
const tsAliases = createViteAliases(__dirname);
export const alias = { ...rootAlias, ...tsAliases };

// ホットリロード用設定
export default defineConfig(() => {
 return mergeConfig(base, {
  root: path.resolve(__dirname),
  resolve: alias,
  server: {
   watch: {
    // server フォルダは更新してもホットリロードしない
    ignored: [path.resolve(__dirname, 'server/dev-configs/**')]
   }
  }
 });
});

// tsconfig.json の paths を Vite の resolve.alias 形式に変換する関数
export function createViteAliases(baseDir: string): Record<string, string> {
 const aliases: Record<string, string> = {};
 const paths = tsconfig.compilerOptions.paths;

 // paths が存在しない場合は空のオブジェクトを返す
 if (!paths) return aliases;

 // tsconfig.json のパスを Vite の形式に変換
 for (const alias in paths) {
  const value = paths[alias][0];
  const key = alias.replace('/*', '');
  // `/*` を取り除き、`path.resolve` で絶対パスに変換
  aliases[key] = path.resolve(baseDir, value.replace('/*', ''));
 }

 return aliases;
}
