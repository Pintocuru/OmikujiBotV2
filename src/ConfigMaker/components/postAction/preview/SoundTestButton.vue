<!-- src/ConfigMaker/components/postAction/preview/SoundTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!sound && !soundPath" class="btn btn-xs btn-secondary">
    サウンドのテスト実行
  </button>
</template>

<script setup lang="ts">
  import { SoundKeyType } from '@/types'
  import { playSoundResolved } from '@sounds/PlaySound'

  const props = defineProps<{
    sound: SoundKeyType | ''
    soundPath: string
  }>()

  // pattern をサウンド名として再生
  function handleClick() {
    playSoundResolved(props.sound, props.soundPath)
  }
</script>
