<!-- src/configMaker/components/RecordTabs/RecordTabs.vue -->
<template>
  <div class="space-y-4">
    <!-- フィルターコンポーネント -->
    <RecordFilter />

    <!-- タブ部分 -->
    <RecordTabList />

    <!-- 右クリックコンテキストメニュー -->
    <RecordContextMenu />
  </div>
</template>

<script setup lang="ts">
  import RecordFilter from './RecordFilter.vue'
  import RecordContextMenu from './RecordContextMenu.vue'
  import RecordTabList from './RecordTabList.vue'
</script>
