<!-- src/ConfigMaker/components/meta/PackageSystemInfo.vue -->
<template>
  <!-- ジェネレータ名 (読み取り専用) -->
  <SettingItem label="アプリ名" description="このパッケージを生成したアプリ名">
    <div class="flex items-center gap-3">
      <Settings class="w-4 h-4 text-base-content/50" />
      <span class="text-sm text-base-content/60">{{ meta.generatorName }}</span>
    </div>
  </SettingItem>

  <!-- ジェネレータバージョン (読み取り専用) -->
  <SettingItem label="アプリバージョン" description="このアプリのバージョン">
    <div class="flex items-center gap-3">
      <Tag class="w-4 h-4 text-base-content/50" />
      <span class="text-sm text-base-content/60">{{ meta.generatorVersion }}</span>
      <button
        @click="omikujiStore.openLatestRelease"
        class="btn btn-primary btn-outline"
        title="最新バージョンを入手する"
      >
        <ExternalLink class="w-4 h-4" />
      </button>
    </div>
  </SettingItem>

  <!-- ID (読み取り専用) -->
  <SettingItem label="データバージョン" description="このデータのスキーマバージョン">
    <div class="flex items-center gap-3">
      <Code class="w-4 h-4 text-base-content/50" />
      <span class="font-mono text-sm text-base-content/60 select-all">{{ meta.dataVersion }}</span>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@shared/components/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'
  import { Code, Settings, Tag, ExternalLink } from 'lucide-vue-next'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
