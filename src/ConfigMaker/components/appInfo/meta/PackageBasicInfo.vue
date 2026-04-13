<!-- src/ConfigMaker/components/appInfo/meta/PackageBasicInfo.vue -->
<template>
  <!-- このデータのid -->
  <SettingItem label="id" description="プラグインでは、この名称で保存されます">
    <div class="flex items-center gap-3">
      <span class="font-mono text-sm text-base-content/60">{{ meta.id }}</span>
      <button class="btn btn-xs btn-ghost gap-1" @click="handleRegenerateId">
        <RefreshCw :size="12" />
        再生成
      </button>
    </div>
  </SettingItem>

  <!-- その他のメタ情報 -->
  <template v-for="field in metaFields" :key="field.key">
    <!-- タグは特別表示 -->
    <SettingItem v-if="field.key === 'tags'" :label="field.label" :description="field.description">
      <div class="flex items-center gap-2 flex-wrap">
        <span v-for="(tag, index) in meta.tags" :key="index" class="badge badge-outline text-xs">
          {{ tag }}
        </span>
      </div>
    </SettingItem>

    <!-- 通常フィールド -->
    <SettingItem v-else :label="field.label" :description="field.description">
      <div class="flex items-center gap-3">
        <span :class="['text-sm text-base-content/60', field.mono && 'font-mono']">
          {{ meta[field.key] }}
        </span>
      </div>
    </SettingItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RefreshCw } from 'lucide-vue-next'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'
  import { generateId } from '@shared/types/core/BaseSchema'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)

  // id 以外のフィールド定義
  const metaFields = [
    { key: 'name', label: 'パッケージ名', description: 'パッケージ(データ)の名称', mono: false },
    { key: 'description', label: 'パッケージ説明', description: 'どんな内容を表示できるかを端的に説明', mono: false },
    { key: 'version', label: 'バージョン', description: 'パッケージのバージョン情報', mono: true },
    { key: 'author', label: '作者', description: 'パッケージの作成者名', mono: false },
    { key: 'tags', label: 'タグ', description: 'パッケージの分類に使用されるタグ', mono: false },
  ] as const

  // id 再生成ハンドラ
  const handleRegenerateId = async () => {
    const result = await swalModal.warning({
      title: 'IDを変更しますか？',
      text: '変更すると、このパッケージのIDが新しく生成されます。',
      showCancelButton: true,
      confirmButtonText: '変更する',
      cancelButtonText: 'キャンセル',
    })

    if (!result.isConfirmed) return

    data.value.meta.id = generateId()
    omikujiStore.hasChanged = true
  }
</script>
