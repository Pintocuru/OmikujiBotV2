// tools/CreateOmikujiData.ts
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { generateJsContent } from '../src/configMaker/components/presets/generateContent';

// ESModuleでの__dirname取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '../');

const targetFolder = path.resolve(packageRoot, 'server/omikujiDatas/');
const omikujiDatasFolder = path.resolve(packageRoot, 'assets/OmikujiDatas/');
const shimsPath = path.resolve(packageRoot, 'src/types/shims-vue.d.ts');

/*
 * OmikujiData のjsonデータをjsファイルにする
 */
async function convertAllJsonFiles() {
 try {
  const files = await fs.readdir(targetFolder);

  for (const file of files) {
   if (file.endsWith('.json')) {
    const inputPath = path.join(targetFolder, file);
    const outputFileName = file.replace(/\.json$/, '.js');
    const outputPath = path.join(omikujiDatasFolder, outputFileName);

    const jsonData = await fs.readFile(inputPath, 'utf-8');
    const jsContent = generateJsContent(jsonData);

    await fs.writeFile(outputPath, jsContent, 'utf-8');
    console.log(`✅ Converted: ${file} → ${outputFileName}`);
   }
  }
 } catch (error) {
  console.error('❌ Error converting JSON files:', error);
 }
}

/*
 * shims-vue.d.ts を生成
 */
async function createShimsVue() {
 const content = `declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}`;
 await fs.mkdir(path.dirname(shimsPath), { recursive: true });
 await fs.writeFile(shimsPath, content, 'utf-8');
 console.log(`✅ Created: ${shimsPath}`);
}

(async () => {
 await convertAllJsonFiles();
 await createShimsVue();
})();

(async () => {
 // 並行で実行
 convertAllJsonFiles();
 createShimsVue();
})();
