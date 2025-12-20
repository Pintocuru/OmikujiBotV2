<!-- src/ConfigMaker/components/meta/PackageMetaEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- 基本情報 -->
    <SectionCard
      variant="outline-secondary"
      :isOpen="true"
      title="基本情報"
      description="このおみくじパッケージに関する情報です"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- 配布情報 -->
    <SectionCard
      variant="outline-secondary"
      :isOpen="true"
      title="配布情報"
      description="おみくじパッケージのライセンスや配布先の表示です"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- システム情報 -->
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
  import PackageBasicInfo from './PackageBasicInfo.vue'
  import PackageDistributionInfo from './PackageDistributionInfo.vue'
  import PackageSystemInfo from './PackageSystemInfo.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
</script>
