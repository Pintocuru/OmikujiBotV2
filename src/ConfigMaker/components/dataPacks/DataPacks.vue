<!-- src/ConfigMaker/components/dataPacks/DataPacks.vue -->
<template>
  <SectionCard
    v-if="hasAccess(itemSlotEnabled)"
    icon="LayoutGrid"
    :isOpen="true"
    title="データパック"
    description="GitHubから公開データパックを読み込んでテンプレートとして利用できます"
  >
    <!-- ローディング -->
    <div v-if="loading" class="flex items-center gap-2 py-6 justify-center text-base-content/60">
      <span class="loading loading-spinner loading-sm" />
      <span class="text-sm">データパックを読み込み中...</span>
    </div>

    <!-- エラー -->
    <div v-else-if="error" class="alert alert-error text-sm">
      <span>{{ error }}</span>
    </div>

    <!-- 空 -->
    <template v-else-if="isEmpty">
      <NoParamsCard message="データパックが見つかりませんでした" />
    </template>

    <!-- 一覧グリッド -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DataPackCard
        v-for="pack in packs"
        :key="pack.path"
        :pack="pack"
        :disabled="importManager.isLoading.value"
        @replace="onReplace(pack)"
        @partial-load="onPartialLoad(pack)"
      />
    </div>

    <!-- 更新ボタン -->
    <div class="mt-4 flex justify-end">
      <button class="btn btn-sm btn-outline" :disabled="loading" @click="fetchAll">
        <span v-if="loading" class="loading loading-spinner loading-xs" />
        <span v-else>更新</span>
      </button>
    </div>
  </SectionCard>

  <!-- インポートプレビューモーダル（部分読み込み用） -->
  <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useDataPacks, type DataPackEntry } from './useDataPacks'
  import DataPackCard from './DataPackCard.vue'
  import ConfigImportModal from '@config/components/presetsImport/ConfigImportModal.vue'
  import { useImportManager } from '@config/components/presetsImport/composables/useImportManager'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useAccessChecker } from '@config/scripts/useAccessCheckerConfig'
  import { useFlagsSettings } from '@/ConfigMaker/components/appInfo/FlagsSettings/useFlagsSettings'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  const { itemSlotEnabled } = useFlagsSettings()
  const { hasAccess } = useAccessChecker()

  const { packs, loading, error, isEmpty, fetchAll } = useDataPacks()
  const importManager = useImportManager()
  const omikujiStore = useOmikujiStore()

  onMounted(fetchAll)

  // ------------------------------------------------------------------
  // 置き換え
  // ------------------------------------------------------------------
  async function onReplace(pack: DataPackEntry) {
    // 確認ダイアログ
    const result = await swalModal.confirmDelete({
      title: '現在のデータを置き換えますか？',
      text: `「${pack.meta.name}」で上書きします。現在の設定はすべて失われます。この操作は取り消せません。`,
      confirmButtonText: '置き換える',
    })
    if (!result.isConfirmed) return

    try {
      const res = await importManager.loadFromJsonData(pack.json)
      if (!res.success) {
        await swalModal.error({
          title: '読み込みエラー',
          text:
            res.error === 'invalid-metadata'
              ? 'このデータはおみくじBOTのデータではありません。'
              : res.error || '不明なエラーが発生しました',
        })
        return
      }

      // 置き換えは全データをそのままロード
      omikujiStore.loadData(res.data)
      omikujiStore.resetChangeState()

      await swalModal.success({
        title: '読み込みました',
        text: `「${pack.meta.name}」を読み込みました。`,
      })
    } catch (err) {
      console.error('[DataPacks] replace error:', err)
      await swalModal.error({ title: '置き換えに失敗しました', text: 'コンソールログをご確認ください' })
    }
  }

  // ------------------------------------------------------------------
  // 部分読み込み（マージ）
  // ------------------------------------------------------------------
  async function onPartialLoad(pack: DataPackEntry) {
    try {
      const res = await importManager.loadFromJsonData(pack.json)
      if (!res.success) {
        await swalModal.error({
          title: '読み込みエラー',
          text:
            res.error === 'invalid-metadata'
              ? 'このデータはおみくじBOTのデータではありません。'
              : res.error || '不明なエラーが発生しました',
        })
        return
      }

      importManager.generatePreview()
      importManager.openPreviewModal()
    } catch (err) {
      console.error('[DataPacks] partial-load error:', err)
      await swalModal.error({ title: '読み込みに失敗しました', text: 'コンソールログをご確認ください' })
    }
  }
</script>
