<!-- src/ConfigMaker/components/RecordTabs/RecordTabs.vue -->
<template>
  <!-- フィルターコンポーネント -->
  <RecordFilter />

  <!-- タブ部分 -->
  <RecordTabList />

  <!-- 右クリックコンテキストメニュー -->
  <RecordContextMenu />
</template>

<script setup lang="ts">
  import RecordFilter from './RecordFilter.vue'
  import RecordContextMenu from './RecordContextMenu.vue'
  import RecordTabList from './RecordTabList.vue'
</script>
