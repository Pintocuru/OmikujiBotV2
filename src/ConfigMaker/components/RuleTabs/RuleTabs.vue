<!-- src/configMaker/components/RuleTabs/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- フィルターコンポーネント -->
  <RuleFilter />

  <!-- タブ部分 -->
  <RuleTabList />

  <!-- 右クリックコンテキストメニュー -->
  <RuleContextMenu />
 </div>
</template>

<script setup lang="ts">
import RuleFilter from './RuleFilter.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import RuleTabList from './RuleTabList.vue';
</script>
