<!-- src/ConfigMaker/components/postAction/preview/WordPartyTestButton.vue -->
<template>
  <button @click="handleClick" :disabled="!pattern && !id" class="btn btn-xs btn-secondary">
    WordPartyのテスト実行
  </button>
</template>

<script setup lang="ts">
  import { executeWordParty } from '@shared/sdk/post/PostWordParty'

  const props = defineProps<{
    id?: string
    pattern: string | null
    repeat?: number | 'viewer' | 'upVote'
  }>()

  function normalizeRepeat(repeat: number | 'viewer' | 'upVote' | undefined): number {
    if (repeat === 'viewer' || repeat === 'upVote') {
      return Math.floor(Math.random() * 30) + 1
    }
    return repeat ?? 1
  }

  function handleClick() {
    executeWordParty({
      wordPartyId: props.id,
      wordParty: props.pattern ? props.pattern.replace(/^[\^\s]+|[\$\s]+$/g, '') : undefined,
      repeat: normalizeRepeat(props.repeat),
    }).catch((err) => {
      console.error('WordPartyテスト実行エラー:', err)
    })
  }
</script>
