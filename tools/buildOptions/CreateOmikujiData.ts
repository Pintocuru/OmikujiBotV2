// tools\buildOptions\CreateOmikujiData.ts
import path from 'path'
import fs from 'fs/promises'

/*
 * shims-vue.d.ts を生成
 */
export async function createShimsVue(packageRoot: string) {
  const shimsPath = path.resolve(packageRoot, 'src/types/shims-vue.d.ts')

  const content = `declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}`
  await fs.mkdir(path.dirname(shimsPath), { recursive: true })
  await fs.writeFile(shimsPath, content, 'utf-8')
  console.log(`✅ Created: ${shimsPath}`)
}
