<!-- src/ConfigMaker/components/parts/ExternalLinkButton.vue -->
<template>
  <button v-if="isValidUrl(url)" @click="openUrl" class="btn btn-primary btn-outline" :title="title">
    <ExternalLink class="w-4 h-4" />
  </button>
</template>

<script setup lang="ts">
  import { ExternalLink } from 'lucide-vue-next'

  // Props
  const props = withDefaults(
    defineProps<{
      url: string
      title?: string
    }>(),
    {
      title: 'サイトを開く',
    }
  )

  // URL検証
  const isValidUrl = (urlValue: string): boolean => {
    if (!urlValue) return false
    try {
      new URL(urlValue)
      return true
    } catch {
      return false
    }
  }

  // URLを開く
  const openUrl = () => {
    if (isValidUrl(props.url)) {
      window.open(props.url, '_blank', 'noopener,noreferrer')
    }
  }
</script>
