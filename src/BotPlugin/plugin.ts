// src/MainPlugin/plugin.ts
import { fileURLToPath } from 'url'
import path from 'path'
import { pluginRequest } from '../../server/adapters/pluginAdapter'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { OnePlugin, PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginName = 'おみくじBOTプラグイン+'

const plugin: OnePlugin = {
  name: `${pluginName}  OmikujiBotPluginPlus`,
  uid: 'OmikujiBotPluginPlus',
  version: '2.0.0-beta-7',
  author: 'Pintocuru',
  url: path.resolve(__dirname, './index.html'),
  permissions: [],
  defaultState: {},

  async init(api, initialData) {
    try {
      // プラグインの起動メッセージ
      ConsolePost('info', `【${pluginName}】がONだよ`)
    } catch (error) {
      console.error('Plugin initialization failed:', error)
      ConsolePost('error', `プラグインの初期化に失敗しました: ${error}`)
      throw error
    }
  },

  async request(req: PluginRequest): Promise<PluginResponse> {
    return await pluginRequest(req)
  },
  destroy() {
    ConsolePost('info', `【${pluginName}】がOFFだよ`)
  },
}

export default plugin
