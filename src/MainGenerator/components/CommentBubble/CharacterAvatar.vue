<!-- src\MainGenerator\components\CommentBubble\CharacterAvatar.vue -->
<template>
  <div
    v-if="profileImage.length > 0"
    class="avatar"
    :class="{
      'rounded-full overflow-hidden': showCharacterFrame,
    }"
    :style="showCharacterFrame ? { backgroundColor: props.backgroundColor } : {}"
  >
    <LayerImage :layers="profileImage" :size="characterSize" />
  </div>
</template>

<script setup lang="ts">
  import LayerImage from '@/common/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      profileImage: string[] | string
      characterSize?: number
      backgroundColor?: string
      showCharacterFrame?: boolean
    }>(),
    {
      characterSize: 16,
      backgroundColor: '#ccc',
      showCharacterFrame: true,
    }
  )
</script>
