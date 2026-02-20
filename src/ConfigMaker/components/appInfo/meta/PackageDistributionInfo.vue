<!-- src/ConfigMaker/components/appInfo/meta/PackageDistributionInfo.vue -->
<template>
  <!-- ライセンス (読み取り専用) -->
  <SettingItem label="ライセンス" description="omikujiData.js のライセンス。画像などは対象外です">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.license }}</span>
    </div>
  </SettingItem>

  <!-- URL (読み取り専用) -->
  <SettingItem label="配布サイトURL" description="パッケージの配布サイトやプロジェクトページのURL">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60 break-all">{{ meta.url || '未設定' }}</span>
      <ExternalLinkButton v-if="meta.url" :url="meta.url" />
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import ExternalLinkButton from '@config/components/parts/ExternalLinkButton.vue'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
