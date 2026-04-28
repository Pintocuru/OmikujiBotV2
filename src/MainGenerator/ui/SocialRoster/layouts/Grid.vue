<!-- src/MainGenerator/ui/SocialRoster/layouts/Grid.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <div
      ref="gridRef"
      class="grid w-full justify-center"
      :style="{
        gridTemplateColumns: props.maxColumns
          ? `repeat(${props.maxColumns}, ${size}px)`
          : `repeat(auto-fit, minmax(${size}px, max-content))`,
      }"
    >
      <Cell
        v-for="user in limitedUsers"
        :key="`${user.userId}-${user.timestamp}`"
        :size="size"
        :seat="user"
        :index="0"
        :sortKey="sortKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue'
  import { useResizeObserver } from '@vueuse/core'
  import { UserStatsRecord, SocialSortKey } from '@/types'
  import Cell from './Cell.vue'

  const props = defineProps<{
    users: UserStatsRecord[]
    sortKey: SocialSortKey
    size: number
    maxRows: number | null
    maxColumns: number | null
  }>()

  const gridRef = useTemplateRef('gridRef')

  const containerWidth = ref(0)
  useResizeObserver(gridRef, (entries) => {
    containerWidth.value = entries[0].contentRect.width
  })

  const limitedUsers = computed(() => {
    if (props.maxRows == null) return props.users

    const columns = props.maxColumns ?? Math.floor(containerWidth.value / props.size)

    if (columns <= 0) return props.users

    return props.users.slice(0, props.maxRows * columns)
  })
</script>
