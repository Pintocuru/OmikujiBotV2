<template>
  <div class="avatar">
    <div class="rounded-full" :class="ringClass" :style="{ width: size + 'px', height: size + 'px' }">
      <img v-if="profileImage" :src="profileImage" :alt="userName" />
      <div
        v-else
        class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-lg font-bold"
      >
        {{ userName?.charAt(0) ?? '?' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    userName: string
    profileImage?: string
    size: number
    ringClass?: string
  }>()
</script>
