// src/MainPlugin/plugin.ts
import { pluginRequest } from '../../server/adapters/pluginAdapter'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { OnePlugin, PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'
import { PLUGIN_KEY, PLUGIN_NAME } from '@/types'
import { APP_VERSION } from '@/version'
import { processOmikenComment } from '@shared/sdk/subscribe/OmikenComment/OmikenCommentProcessor'
import { hoge } from './scripts/hoge'

const plugin: OnePlugin = {
  name: `${PLUGIN_NAME} ${PLUGIN_KEY}`,
  uid: PLUGIN_KEY,
  version: APP_VERSION,
  author: 'Pintocuru',
  url: '', // TODO:あとで配布URLを入れる
  permissions: ['filter.comment'],
  defaultState: {},

  async init(api, initialData) {
    try {
      postSystemMessage(`【${PLUGIN_NAME}】がONだよ`, 'info')
    } catch (error) {
      console.error('Plugin initialization failed:', error)
      postSystemMessage(`プラグインの初期化に失敗しました: ${error}`)
      throw error
    }
  },

  async filterComment(comment, service, userData) {
    const omiken = processOmikenComment(comment)
    hoge(omiken)

    // コメント自体はそのまま返す
    return comment
  },

  async request(req: PluginRequest): Promise<PluginResponse> {
    return await pluginRequest(req)
  },
  destroy() {
    postSystemMessage(`【${PLUGIN_NAME}】がOFFだよ`, 'info')
  },
}

export default plugin
