<!-- src/MainGenerator/ui/CounterPreview/layouts/UserNameBadge.vue -->
<template>
  <li class="badge badge-xl badge-warning">
    <div class="avatar">
      <div class="w-7 rounded-full">
        <img :src="profileImage || getAvatarUrl(userName || 'Anonymous')" alt="" class="w-full h-full object-cover" />
      </div>
    </div>
    {{ userName }}
  </li>
</template>

<script setup lang="ts">
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  defineProps<{
    profileImage: string
    userName: string
  }>()
</script>
