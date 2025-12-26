<!-- src/ConfigMaker/components/meta/PackageMetaEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- アプリ設定 -->
    <SectionCard :isOpen="true" title="アプリ設定" description="このコンフィグエディターに関する設定です">
      <SettingsEditor />
    </SectionCard>

    <!-- 実績 -->
    <SectionCard :isOpen="true" title="利用可能な機能" description="PRO版を使うと機能が増えます">
      <FeatureUsageSettings />
    </SectionCard>

    <!-- meta:基本情報 -->
    <SectionCard
      variant="outline-secondary"
      :isOpen="true"
      title="基本情報"
      description="このおみくじパッケージに関する情報です"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- meta:配布情報 -->
    <SectionCard
      variant="outline-secondary"
      :isOpen="true"
      title="配布情報"
      description="おみくじパッケージのライセンスや配布先の表示です"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- meta:システム情報 -->
    <SectionCard
      variant="outline-secondary"
      :isOpen="true"
      title="システム情報"
      description="このアプリ「おみくじBOT」の情報です"
    >
      <PackageSystemInfo />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import SettingsEditor from './settings/SettingsEditor.vue'
  import FeatureUsageSettings from './FeatureUsage/FeatureUsageSettings.vue'
  import PackageBasicInfo from './meta/PackageBasicInfo.vue'
  import PackageDistributionInfo from './meta/PackageDistributionInfo.vue'
  import PackageSystemInfo from './meta/PackageSystemInfo.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
</script>
