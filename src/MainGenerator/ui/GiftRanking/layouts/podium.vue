<!-- src/MainGenerator/ui/GiftRanking/layouts/podium.vue -->
<template>
  <div class="p-3 w-full">
    <!-- 表彰台（1〜3位） -->
    <div class="flex items-end justify-center gap-3 mb-3">
      <!-- 2位 -->
      <div v-if="messages[1]" class="flex flex-col items-center gap-1">
        <div class="avatar">
          <div class="rounded-full w-12 ring-2 ring-secondary">
            <img v-if="messages[1].profileImage" :src="messages[1].profileImage" :alt="messages[1].userName" />
            <div
              v-else
              class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-lg font-bold"
            >
              {{ messages[1].userName?.charAt(0) ?? '?' }}
            </div>
          </div>
        </div>
        <p v-if="show('name')" class="text-xs text-base-content truncate max-w-[60px] text-center">
          {{ messages[1].userName }}
        </p>
        <p v-if="show('amount')" class="text-xs font-bold text-secondary">
          <span class="opacity-60">¥</span>{{ formatPrice(messages[1].giftPrice) }}
        </p>
        <div
          class="bg-secondary text-secondary-content rounded-t-md w-16 h-10 flex items-center justify-center text-sm font-bold"
        >
          2
        </div>
      </div>

      <!-- 1位 -->
      <div v-if="messages[0]" class="flex flex-col items-center gap-1">
        <div class="avatar">
          <div class="rounded-full w-16 ring-2 ring-primary">
            <img v-if="messages[0].profileImage" :src="messages[0].profileImage" :alt="messages[0].userName" />
            <div
              v-else
              class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-xl font-bold"
            >
              {{ messages[0].userName?.charAt(0) ?? '?' }}
            </div>
          </div>
        </div>
        <p v-if="show('name')" class="text-sm font-bold text-base-content truncate max-w-[72px] text-center">
          {{ messages[0].userName }}
        </p>
        <p v-if="show('amount')" class="text-sm font-bold text-primary">
          <span class="opacity-60 text-xs">¥</span>{{ formatPrice(messages[0].giftPrice) }}
        </p>
        <div
          class="bg-primary text-primary-content rounded-t-md w-16 h-16 flex items-center justify-center text-lg font-bold"
        >
          1
        </div>
      </div>

      <!-- 3位 -->
      <div v-if="messages[2]" class="flex flex-col items-center gap-1">
        <div class="avatar">
          <div class="rounded-full w-10 ring-2 ring-accent">
            <img v-if="messages[2].profileImage" :src="messages[2].profileImage" :alt="messages[2].userName" />
            <div
              v-else
              class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-base font-bold"
            >
              {{ messages[2].userName?.charAt(0) ?? '?' }}
            </div>
          </div>
        </div>
        <p v-if="show('name')" class="text-xs text-base-content truncate max-w-[52px] text-center">
          {{ messages[2].userName }}
        </p>
        <p v-if="show('amount')" class="text-xs font-bold text-accent">
          <span class="opacity-60">¥</span>{{ formatPrice(messages[2].giftPrice) }}
        </p>
        <div
          class="bg-accent text-accent-content rounded-t-md w-16 h-7 flex items-center justify-center text-sm font-bold"
        >
          3
        </div>
      </div>
    </div>

    <!-- 4位以降リスト -->
    <div v-if="messages.length > 3" class="flex flex-col gap-1">
      <div
        v-for="(message, index) in messages.slice(3)"
        :key="message.id"
        class="flex items-center gap-2 px-2 py-1 rounded bg-base-100"
      >
        <span v-if="show('rank')" class="text-xs text-base-content/50 w-4 text-right flex-shrink-0">{{
          index + 4
        }}</span>
        <div v-if="show('avatar')" class="avatar flex-shrink-0">
          <div class="rounded-full w-6 ring-1 ring-base-300">
            <img v-if="message.profileImage" :src="message.profileImage" :alt="message.userName" />
            <div
              v-else
              class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-xs font-bold"
            >
              {{ message.userName?.charAt(0) ?? '?' }}
            </div>
          </div>
        </div>
        <p v-if="show('name')" class="flex-1 text-xs text-base-content truncate">{{ message.userName }}</p>
        <p v-if="show('amount')" class="flex-shrink-0 text-xs font-bold text-base-content/70">
          <span class="opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GiftLayoutProps } from '../composables/types'
  import { formatPrice } from '../composables/useRankStyle'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: 'avatar' | 'name' | 'amount' | 'rank') => props.displayOptions.includes(key)
</script>
