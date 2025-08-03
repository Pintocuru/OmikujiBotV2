// vite.config.ts
import { baseViteConfig, rootAlias } from '../../buildRoot/viteConfigBase';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const base = baseViteConfig(__dirname);

// パッケージのエイリアス
export const alias = {
 ...rootAlias,
 '@type': path.resolve(__dirname, 'src/types'),
 '@assets': path.resolve(__dirname, 'assets'),
 '@': path.resolve(__dirname, 'src'),
 '@GameScripts': path.resolve(__dirname, '../../GameScripts'),
 '@LogRank': path.resolve(__dirname, '../../GameScripts/LogRank/src'),
 '@Config': path.resolve(__dirname, 'src/ConfigMaker'),
 '@ConfigComponents': path.resolve(__dirname, 'src/ConfigMaker/components'),
 '@ConfigScript': path.resolve(__dirname, 'src/ConfigMaker/script'),
 '@ConfigStore': path.resolve(__dirname, 'src/ConfigMaker/store')
};

// ホットリロード用設定
export default defineConfig(() => {
 return mergeConfig(base, {
  root: path.resolve(__dirname),
  resolve: { alias }
 });
});
