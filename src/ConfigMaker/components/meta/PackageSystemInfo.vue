<!-- src/ConfigMaker/components/meta/PackageSystemInfo.vue -->
<template>
  <SectionCard variant="outline-secondary" :isOpen="false">
    <template #header>
      <div>システム情報</div>
      <div class="text-sm pr-2">このアプリ「おみくじBOT」の情報です</div>
    </template>

    <template #body>
      <!-- ID (読み取り専用) -->
      <SettingItem label="パッケージID" description="パッケージの一意識別子" :showReset="false">
        <div class="flex items-center gap-3">
          <Code class="w-4 h-4 text-base-content/50" />
          <span class="font-mono text-sm text-base-content/60 select-all">{{ meta.id }}</span>
        </div>
      </SettingItem>

      <!-- ジェネレータ名 (読み取り専用) -->
      <SettingItem label="対応アプリ名" description="このパッケージを生成したアプリケーション名" :showReset="false">
        <div class="flex items-center gap-3">
          <Settings class="w-4 h-4 text-base-content/50" />
          <span class="text-sm text-base-content/60">{{ meta.generatorName }}</span>
        </div>
      </SettingItem>

      <!-- ジェネレータバージョン (読み取り専用) -->
      <SettingItem label="アプリバージョン" description="対応アプリケーションのバージョン" :showReset="false">
        <div class="flex items-center gap-3">
          <Tag class="w-4 h-4 text-base-content/50" />
          <span class="text-sm text-base-content/60">{{ meta.generatorVersion }}</span>
        </div>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { Code, Settings, Tag } from 'lucide-vue-next'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
