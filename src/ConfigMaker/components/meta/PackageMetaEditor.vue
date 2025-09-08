<!-- src/ConfigMaker/components/meta/PackageMetaEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- 基本情報 -->
    <SectionCard
      :variant="isPro ? 'secondary' : 'outline-secondary'"
      :isOpen="activeSection === 'basic'"
      @toggle="toggleSection('basic')"
      title="基本情報"
      description="このおみくじパッケージに関する情報です"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- 配布情報 -->
    <SectionCard
      :variant="isPro ? 'secondary' : 'outline-secondary'"
      :isOpen="activeSection === 'distribution'"
      @toggle="toggleSection('distribution')"
      title="配布情報"
      description="おみくじパッケージのライセンスや配布先の表示です"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- システム情報 -->
    <SectionCard
      variant="outline-secondary"
      :isOpen="activeSection === 'system'"
      @toggle="toggleSection('system')"
      title="システム情報"
      description="このアプリ「おみくじBOT」の情報です"
    >
      <PackageSystemInfo />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PackageBasicInfo from './PackageBasicInfo.vue'
  import PackageDistributionInfo from './PackageDistributionInfo.vue'
  import PackageSystemInfo from './PackageSystemInfo.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  const { isPro } = useSettingMode()

  // アクティブなセクションの管理
  type SectionType = 'basic' | 'distribution' | 'system' | null
  const activeSection = ref<SectionType>('basic')

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }
</script>
