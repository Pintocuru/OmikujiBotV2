<!-- src/MainGenerator/ui/CounterPreview/layouts/UserCardScroller.vue -->
<template>
  <CounterCardBase :counter-setting="counterSetting">
    <div v-if="counterSetting.label !== ''" class="text-xl mb-2">
      {{ counterSetting.label }}
    </div>

    <ul class="flex flex-col">
      <TransitionGroup name="slide-in" tag="div">
        <li
          v-for="user in displayedUsers"
          :key="user.userId"
          class="flex items-center gap-4 px-2 py-1 mb-1 rounded-lg bg-base-200/60 shadow"
        >
          <!-- avatar -->
          <div v-if="user.profileImage" class="avatar shrink-0">
            <div class="w-88 rounded-full">
              <img :src="user.profileImage" alt="" />
            </div>
          </div>

          <div v-else class="avatar placeholder shrink-0">
            <div class="w-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
              {{ (user.userName || 'A').charAt(0) }}
            </div>
          </div>

          <!-- name -->
          <div class="text-base text-base-content truncate">
            {{ user.userName }}
          </div>
        </li>
      </TransitionGroup>
    </ul>
  </CounterCardBase>
</template>

<script setup lang="ts">
  import { CounterPreviewType } from '@/types'
  import { useCounterDisplay } from './base/useCounterDisplay'
  import CounterCardBase from './base/CounterCardBase.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    counterSetting: CounterPreviewType
    count: number | null
    users: UserNameType[]
  }>()

  const { displayedUsers } = useCounterDisplay(props, {
    showCounter: false,
    limitUserCount: 20,
  })
</script>

<style scoped>
  /* 新規追加時のみ右→左 */
  .slide-in-enter-from {
    transform: translateX(40px);
    opacity: 0;
  }
  .slide-in-enter-active {
    transition:
      transform 0.25s ease-out,
      opacity 0.25s ease-out;
  }
  .slide-in-enter-to {
    transform: translateX(0);
    opacity: 1;
  }

  /* 既存要素・削除時は一切動かさない */
  .slide-in-move,
  .slide-in-leave-active {
    transition: none;
  }
</style>
