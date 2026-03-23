<!-- src/ConfigMaker/components/events/CharacterChanger/CharacterStatistics.vue -->
<template>
  <div class="stats stats-vertical sm:stats-horizontal shadow w-full">
    <div class="stat">
      <div class="stat-title">対象アイテム数</div>
      <div class="stat-value text-primary">{{ totalItems }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">使用中のキャラクター</div>
      <div class="stat-value text-secondary">{{ uniqueCharacterCount }}</div>
    </div>
    <div class="stat" :class="hasInvalidCharacters ? 'bg-error/10' : ''">
      <div class="stat-title">未定義キャラクター</div>
      <div :class="['stat-value', hasInvalidCharacters ? 'text-error' : 'text-success']">
        {{ invalidCharacterCount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    totalItems: number
    uniqueCharacterCount: number
    invalidCharacterCount: number
    hasInvalidCharacters: boolean
  }>()
</script>
