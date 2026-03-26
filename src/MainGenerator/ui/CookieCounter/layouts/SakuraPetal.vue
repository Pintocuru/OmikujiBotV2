<!-- src/MainGenerator/ui/CookieCounter/layouts/SakuraPetal.vue -->
<template>
  <img :src="sakuraWebp" class="object-contain" :class="$attrs.class" :style="$attrs.style" alt="" draggable="false" />
</template>

<script setup lang="ts">
  import sakuraWebp from './sakura.webp'

  defineOptions({ inheritAttrs: false })
</script>
