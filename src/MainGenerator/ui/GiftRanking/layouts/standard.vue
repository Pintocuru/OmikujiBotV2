<!-- src/MainGenerator/ui/GiftRanking/layouts/standard.vue -->
<template>
  <div class="p-3 w-full">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="card bg-base-100 shadow-md border border-base-200 relative overflow-hidden"
        :class="show('rank') ? rankCardClass(index) : ''"
      >
        <div class="card-body items-center text-center p-3 pt-5 gap-1">
          <div
            v-if="show('rank')"
            class="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            :class="rankBadgeClass(index)"
          >
            {{ index + 1 }}
          </div>

          <div v-if="show('avatar')" class="avatar">
            <div class="rounded-full ring-2 w-12" :class="show('rank') ? rankRingClass(index) : 'ring-base-300'">
              <img v-if="message.profileImage" :src="message.profileImage" :alt="message.userName" />
              <div
                v-else
                class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-lg font-bold"
              >
                {{ message.userName?.charAt(0) ?? '?' }}
              </div>
            </div>
          </div>

          <p v-if="show('name')" class="text-xs font-medium text-base-content truncate w-full leading-tight">
            {{ message.userName }}
          </p>

          <p v-if="show('amount')" class="font-bold leading-none" :class="rankAmountClass(index)">
            <span class="text-xs opacity-70">¥</span>{{ formatPrice(message.giftPrice) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import {
    formatPrice,
    rankRingClass,
    rankBadgeClass,
    rankCardClass,
    rankAmountClass,
  } from '../composables/useRankStyle'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)
</script>
