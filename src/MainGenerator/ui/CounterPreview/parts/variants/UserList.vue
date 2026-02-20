<!-- src/MainGenerator/ui/CounterPreview/parts/variants/UserList.vue -->
<template>
  <CounterCardBase :counter-setting="counterSetting" :is-bouncing="isBouncing">
    <div class="drop-shadow-md">
      <div v-if="counterSetting.label !== ''" class="text-xl">
        {{ counterSetting.label }}
      </div>
    </div>

    <ul class="flex flex-wrap gap-2 justify-center">
      <li
        v-for="(value, index) in displayedUsers"
        :key="value.userId + '-' + index"
        class="badge badge-warning text-sm"
      >
        <div v-if="value.profileImage !== ''" class="avatar">
          <div class="w-5 rounded-full">
            <img :src="value.profileImage" alt="" />
          </div>
        </div>
        <div v-else class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-5 rounded-full flex items-center justify-center">
            {{ (value.userName || 'A').charAt(0) }}
          </div>
        </div>
        {{ value.userName }}
      </li>
    </ul>
  </CounterCardBase>
</template>

<script setup lang="ts">
  import { SettingsCounterType } from '@/types/'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useCounterDisplay } from '../base/useCounterDisplay'
  import CounterCardBase from '../base/CounterCardBase.vue'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | null
    users: UserVisitRecord[]
  }>()

  const { isBouncing, displayCount, displayedUsers } = useCounterDisplay(props, {
    showCounter: true,
    limitUserCount: null,
  })
</script>
