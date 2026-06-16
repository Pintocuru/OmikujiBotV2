<!-- src/MainGenerator/ui/GiftRanking/layouts/grid.vue -->
<template>
  <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
    <div v-for="(message, index) in messages" :key="message.id" class="flex flex-col items-center gap-1 py-2">
      <div v-if="show('avatar')" class="relative">
        <div class="avatar">
          <div
            class="rounded-full"
            :class="show('rank') ? rankRingClass(index) : ''"
            :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
          >
            <img v-if="message.profileImage" :src="message.profileImage" :alt="message.userName" />
            <div
              v-else
              class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-lg font-bold"
            >
              {{ message.userName?.charAt(0) ?? '?' }}
            </div>
          </div>
        </div>
        <div
          v-if="show('rank')"
          class="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-lg font-bold"
          :class="rankBadgeClass(index)"
        >
          {{ index + 1 }}
        </div>
      </div>

      <div v-else-if="show('rank')" class="badge font-bold" :class="rankBadgeClass(index)">
        {{ index + 1 }}
      </div>

      <p v-if="show('name')" class="text-xl text-base-content truncate w-full text-center leading-tight">
        {{ message.userName }}
      </p>

      <p v-if="show('amount')" class="text-xl font-bold text-primary leading-none">
        <span class="opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import { formatPrice, rankRingClass, rankBadgeClass } from '../composables/useRankStyle'
  import { computed } from 'vue'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)
  const iconSize = computed(() => props.iconSize ?? 80)
</script>
