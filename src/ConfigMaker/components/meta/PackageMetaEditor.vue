<!-- src/ConfigMaker/components/meta/PackageMetaEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- 基本情報 -->
    <PackageBasicInfo />

    <!-- 配布情報 -->
    <PackageDistributionInfo />

    <!-- システム情報 -->
    <PackageSystemInfo />
  </div>
</template>

<script setup lang="ts">
  import PackageBasicInfo from './PackageBasicInfo.vue'
  import PackageDistributionInfo from './PackageDistributionInfo.vue'
  import PackageSystemInfo from './PackageSystemInfo.vue'
</script>
