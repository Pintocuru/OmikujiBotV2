<!-- src/ConfigMaker/components/events/CharacterChanger/InvalidCharacterAlert.vue -->
<template>
  <div class="alert alert-error">
    <AlertTriangle class="w-4 h-4" />
    <div class="flex-1">
      <span class="font-semibold">存在しないキャラクターが使用されています。</span>
      <p class="text-sm mt-1">これらのキャラクターは正常に動作しません。適切なキャラクターに変更してください。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AlertTriangle } from 'lucide-vue-next'
</script>
