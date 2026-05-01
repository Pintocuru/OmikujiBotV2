<!-- src/MainGenerator/ui/CounterPreview/layouts/UserList.vue -->
<template>
  <CounterCardBase :counter-setting="counterSetting" :is-bouncing="isBouncing">
    <div class="drop-shadow-md">
      <div v-if="counterSetting.label !== ''" class="text-xl">
        {{ counterSetting.label }}
      </div>
    </div>

    <ul class="flex flex-wrap gap-2 justify-center">
      <UserNameBadge
        v-for="(value, index) in displayedUsers"
        :key="value.userId + '-' + index"
        :profileImage="value.profileImage"
        :userName="value.userName"
      />
    </ul>
  </CounterCardBase>
</template>

<script setup lang="ts">
  import { CounterPreviewType } from '@/types'
  import { useCounterDisplay } from './base/useCounterDisplay'
  import CounterCardBase from './base/CounterCardBase.vue'
  import UserNameBadge from './UserNameBadge.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    counterSetting: CounterPreviewType
    count: number | null
    users: UserNameType[]
  }>()

  const { isBouncing, displayedUsers } = useCounterDisplay(props, {
    showCounter: true,
    limitUserCount: null,
  })
</script>
