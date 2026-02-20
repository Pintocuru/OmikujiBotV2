<!-- src/ConfigMaker/dev/components/DevHeader.vue -->
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <!-- APIモード切り替えバッジ -->
      <button
        @click="toggleApiMode"
        :disabled="!isDev"
        class="badge transition-colors"
        :class="[devStore.isExpressMode ? 'badge-warning' : 'badge-info', isDev && 'cursor-pointer hover:opacity-80']"
        :title="isDev ? 'クリックでAPIモードを切り替え' : undefined"
      >
        {{ devStore.isExpressMode ? 'DEV' : 'Plugin' }}
      </button>
      <h2 class="text-lg font-bold text-primary-content">
        {{ isDev || isPro ? 'プリセット管理' : 'サーバー連携機能' }}
      </h2>
    </div>

    <div v-if="devStore.isServerConnected" class="flex items-center gap-2">
      <template v-if="!isExpressMode">
        <button
          @click="loadFromGenerator"
          :disabled="devStore.isSaving"
          class="btn btn-secondary btn-sm tooltip tooltip-top"
          data-tip="ジェネレーターの設定を読み込む"
        >
          <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
          <Download class="w-4 h-4 mr-2" />
          サーバーから読み込み
        </button>

        <button
          @click="devStore.saveToGenerator"
          :disabled="devStore.isSaving"
          class="btn btn-primary btn-sm tooltip tooltip-top"
          data-tip="ジェネレーター用設定として保存"
        >
          <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
          <Save class="w-4 h-4 mr-2" />
          サーバーに保存
        </button>
      </template>

      <button
        v-else-if="Object.keys(data.comments).length > 0"
        @click="devStore.overwriteOmikujiData"
        :disabled="devStore.isSaving"
        class="btn btn-primary btn-sm tooltip tooltip-top"
        data-tip="assets/omikujiData.js を上書き保存"
      >
        <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
        <Save class="w-4 h-4 mr-2" />
        omikujiData.js に保存
      </button>

      <button
        v-if="isPro || isDev"
        @click="saveConfigAutoName"
        :disabled="devStore.isSaving"
        class="btn btn-success btn-sm tooltip tooltip-bottom"
        data-tip="現在の設定を日付ファイル名で保存"
      >
        <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
        <Save class="w-4 h-4 mr-2" />
        新規保存
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types'
  import { generateDateFileName } from '@config/dev/services/apiServiceUtils'
  import { generatorApi } from '@config/dev/services/generatorApi'
  import { useDevStore } from '@config/dev/stores/useDevStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { Download, Save } from 'lucide-vue-next'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  const omikujiStore = useOmikujiStore()
  const { data, hasChanged } = storeToRefs(omikujiStore)
  const devStore = useDevStore()
  const { isExpressMode } = storeToRefs(devStore)
  const { isPro } = useSettingMode()

  const toggleApiMode = async () => {
    const ok = await devStore.toggleExpressMode()
    if (ok) {
      await devStore.fetchFileList()
    } else if (isDev) {
      swalToast.error({
        title: 'プラグインサーバ起動しとらんやん！',
        text: '動かん思たら…そらサーバー止まっとったら無理やわな！',
      })
    }
  }

  const loadFromGenerator = async () => {
    try {
      // 変更があるなら確認ダイアログ
      if (hasChanged.value) {
        const result = await swalModal.confirmDelete({
          title: '変更が保存されていません',
          text: '読み込むと現在の編集内容は失われます。続行しますか？',
          confirmButtonText: '読み込む',
        })
        // キャンセル → 処理中断
        if (!result.isConfirmed) return
      }

      const { loadData } = useOmikujiStore()
      const id = window.omikujiData?.meta.id
      const data = await generatorApi.loadGeneratorConfig(id)
      const fileName = id ? `presets/${id}.json` : 'generator.json'

      if (!data) {
        swalToast.warning({
          title: 'ジェネレーター設定が見つかりません',
          text: `${fileName} が存在しませんでした`,
        })
        return
      }

      // ファイル読み込み
      devStore.setSaveFileName()
      loadData(data)
      hasChanged.value = false // 読み込み後は変更なし状態に戻す

      swalToast.success({ title: 'ジェネレーター設定を読み込みました' })
    } catch (error) {
      swalToast.error({
        title: '読み込みに失敗しました',
        text: String(error),
      })
    }
  }

  // 日付ファイル名で保存 > 即開く
  const saveConfigAutoName = async () => {
    const fileName = generateDateFileName()
    await devStore.saveConfig(fileName)
    await devStore.applyConfigFile(fileName)
  }
</script>
