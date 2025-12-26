<!-- src/ConfigMaker/components/meta/PackageBasicInfo.vue -->
<template>
  <!-- パッケージ名 (読み取り専用) -->
  <SettingItem label="パッケージ名" description="テンプレート出力する際に表示する名称">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.name }}</span>
    </div>
  </SettingItem>

  <!-- パッケージ説明 (読み取り専用) -->
  <SettingItem label="パッケージ説明" description="どんな内容を表示できるかを端的に説明">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.description }}</span>
    </div>
  </SettingItem>

  <!-- バージョン (読み取り専用) -->
  <SettingItem label="バージョン" description="パッケージのバージョン情報">
    <div class="flex items-center gap-3">
      <span class="font-mono text-sm text-base-content/60">{{ meta.version }}</span>
    </div>
  </SettingItem>

  <!-- 作者 (読み取り専用) -->
  <SettingItem label="作者" description="パッケージの作成者名">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.author }}</span>
    </div>
  </SettingItem>

  <!-- タグ (読み取り専用) -->
  <SettingItem label="タグ" description="パッケージの分類に使用されるタグ">
    <div class="flex items-center gap-2 flex-wrap">
      <span v-for="(tag, index) in meta.tags" :key="index" class="badge badge-outline text-xs">
        {{ tag }}
      </span>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
