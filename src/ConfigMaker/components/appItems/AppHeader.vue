<!-- src/configMaker/components/appItems/AppHeader.vue -->
<template>
  <h1
    class="flex justify-center text-2xl font-bold mb-6 text-center"
    :class="isGod ? ['text-warning'] : isPro ? ['text-secondary'] : ['text-primary']"
  >
    <div class="flex items-center gap-2">
      おみくじBot コンフィグエディター
      <!-- GOD-MODEバッジ -->
      <span v-if="isGod" class="badge badge-warning tooltip tooltip-bottom" data-tip="私が神です!"> GOD-MODE </span>
      <!-- PRO-MODEバッジ -->
      <span
        v-if="isPro"
        class="badge badge-secondary tooltip tooltip-bottom"
        data-tip="テンプレート出力が可能な、有料版です!"
      >
        PRO
      </span>
    </div>
  </h1>
</template>

<script setup lang="ts">
  import { useSettingMode } from '@/types/SettingMode'
  const { isPro, isGod } = useSettingMode()
</script>
