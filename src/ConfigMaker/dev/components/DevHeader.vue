<!-- src\ConfigMaker\dev\DevHeader.vue -->
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <!-- APIモード切り替えバッジ -->
      <button
        @click="toggleApiMode"
        :disabled="!isDev"
        class="badge transition-colors cursor-pointer hover:opacity-80"
        :class="[devStore.isExpressMode ? 'badge-warning' : 'badge-info', !isDev && 'cursor-not-allowed opacity-50']"
        :title="isDev ? 'クリックでAPIモードを切り替え' : undefined"
      >
        {{ devStore.isExpressMode ? 'DEV' : 'Plugin' }}
      </button>
      <h2 class="text-lg font-bold text-primary-content">プリセット管理</h2>
    </div>

    <div class="flex items-center gap-2">
      <button
        v-if="isExpressMode"
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
        v-else
        @click="devStore.saveToGenerator"
        :disabled="devStore.isSaving"
        class="btn btn-primary btn-sm tooltip tooltip-top"
        data-tip="ジェネレーター用設定として保存"
      >
        <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
        <Save class="w-4 h-4 mr-2" />
        ジェネレーターに保存
      </button>

      <button
        @click="devStore.saveConfigAutoName"
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
  import { isDev } from '@/types'
  import { useDevStore } from '@config/dev/stores/useDevStore'
  import { Save } from 'lucide-vue-next'
  import { storeToRefs } from 'pinia'
  import Swal from 'sweetalert2'

  const devStore = useDevStore()
  const { isExpressMode } = storeToRefs(devStore)

  const toggleApiMode = async () => {
    const isServer = await devStore.checkServer()
    if (isDev && isServer) {
      devStore.toggleApiMode()
      await devStore.fetchFileList()
    } else if (isDev) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'プラグインサーバ起動しとらんやん！',
        text: '動かん思たら…そらサーバー止まっとったら無理やわな！',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#ffecec',
        color: '#b30000',
      })
    }
  }
</script>
