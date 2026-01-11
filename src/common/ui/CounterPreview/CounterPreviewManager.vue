<!-- src/MainGenerator/components/CounterPreview/CounterPreviewManager.vue -->
<template>
  <component :is="currentComponent" :counter-setting="counterSetting" :count="count" :users="users" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CounterComponent, SettingsCounterType } from '@/types/'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import UserList from './variants/UserList.vue'
  import UserCardScroller from './variants/UserCardScroller.vue'
  import CounterUser from './variants/CounterUser.vue'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | null
    users: UserVisitRecord[]
  }>()

  const componentMap: Record<CounterComponent, any> = {
    counterUser: CounterUser,
    userList: UserList,
    UserCardScroller: UserCardScroller,
  }

  const currentComponent = computed(() => {
    return componentMap[props.counterSetting.component] || CounterUser
  })
</script>
