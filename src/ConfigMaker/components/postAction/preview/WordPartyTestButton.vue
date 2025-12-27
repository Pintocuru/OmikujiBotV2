<!-- src\ConfigMaker\components\wordPartySettings\WordPartyTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!pattern" class="btn btn-xs btn-secondary">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
  import { postWordParty } from '@shared/sdk/postMessage/PostOneComme'

  const props = withDefaults(
    defineProps<{
      pattern: string | null
      label?: string
    }>(),
    {
      label: 'テスト実行',
    }
  )

  function handleClick() {
    if (!props.pattern) return
    const pattern = props.pattern.replace(/^[\^\s]+|[\$\s]+$/g, '')
    postWordParty(pattern).catch((err) => {
      console.error('WordPartyテスト実行エラー:', err)
    })
  }
</script>
