<!-- src\ConfigMaker\components\wordPartySettings\SoundTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!props.pattern" class="btn btn-xs btn-secondary">
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
  import { SoundKeyType } from '@/types'
  import { playSound } from '@sounds/PlaySound'

  const props = withDefaults(
    defineProps<{
      pattern?: SoundKeyType | ''
      label?: string
    }>(),
    {
      label: 'サウンドテスト',
    }
  )

  // pattern をサウンド名として再生
  function handleClick() {
    if (!props.pattern) return
    playSound(props.pattern)
  }
</script>
