<!-- src\ConfigMaker\components\wordPartySettings\SoundTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!props.pattern" class="btn btn-xs btn-secondary">
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
  import { playSound } from '@/common/sounds/PlaySound'

  const props = withDefaults(
    defineProps<{
      pattern?: string
      label?: string
    }>(),
    {
      label: 'サウンドテスト',
    }
  )

  function handleClick() {
    if (!props.pattern) return

    // pattern をサウンド名として再生
    playSound(props.pattern)
  }
</script>
