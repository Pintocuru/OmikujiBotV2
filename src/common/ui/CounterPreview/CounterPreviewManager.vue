<!-- src/MainGenerator/components/CounterPreview/CounterPreviewManager.vue -->
<template>
  <component :is="currentComponent" :counter-setting="counterSetting" :count="count" :users="users" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CounterComponent, SettingsCounterType } from '@/types/'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import UserList from './variants/UserList.vue'
  import UserFocusedCounter from './variants/UserFocusedCounter.vue'
  import CounterUser from './variants/CounterUser.vue'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | null
    users: UserVisitRecord[]
  }>()

  const componentMap: Record<CounterComponent, any> = {
    counterUser: CounterUser,
    userList: UserList,
    userFocused: UserFocusedCounter,
  }

  const currentComponent = computed(() => {
    return componentMap[props.counterSetting.component] || CounterUser
  })
</script>
