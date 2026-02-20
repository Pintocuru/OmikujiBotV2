<!-- src/ConfigMaker/components/appInfo/meta/PackageSystemInfo.vue -->
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

      <ExternalLinkButton :url="openLatestRelease()" title="最新バージョンを入手する">
        <ExternalLink class="w-4 h-4" />
      </ExternalLinkButton>
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
  import { storeToRefs } from 'pinia'
  import { Code, Settings, Tag, ExternalLink } from 'lucide-vue-next'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useVersionCheck } from '@config/components/appItems/useVersionCheck'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import ExternalLinkButton from '@config/components/parts/ExternalLinkButton.vue'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
  const generatorVersion = computed(() => meta.value.generatorVersion)

  // バージョンチェック機能（URL取得のみ使用）
  const { openLatestRelease } = useVersionCheck(generatorVersion)
</script>
