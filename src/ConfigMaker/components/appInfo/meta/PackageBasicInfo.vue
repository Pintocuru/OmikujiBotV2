<!-- src/ConfigMaker/components/appInfo/meta/PackageBasicInfo.vue -->
<template>
  <!-- このデータのid -->
  <SettingItem label="id" description="プラグインでは、この名称で保存されます">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.id }}</span>
    </div>
  </SettingItem>

  <!-- パッケージ名 -->
  <SettingItem label="パッケージ名" description="パッケージ(データ)の名称">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.name }}</span>
    </div>
  </SettingItem>

  <!-- パッケージ説明 -->
  <SettingItem label="パッケージ説明" description="どんな内容を表示できるかを端的に説明">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.description }}</span>
    </div>
  </SettingItem>

  <!-- バージョン -->
  <SettingItem label="バージョン" description="パッケージのバージョン情報">
    <div class="flex items-center gap-3">
      <span class="font-mono text-sm text-base-content/60">{{ meta.version }}</span>
    </div>
  </SettingItem>

  <!-- 作者 -->
  <SettingItem label="作者" description="パッケージの作成者名">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.author }}</span>
    </div>
  </SettingItem>

  <!-- タグ -->
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
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
