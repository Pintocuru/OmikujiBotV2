<!-- src/MainGenerator/ui/CounterPreview/parts/CounterPreviewSelector.vue -->
<template>
  <component :is="currentComponent" :counter-setting="counterSetting" :count="count" :users="users" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CounterComponent, CounterPreviewType } from '@/types'
  import UserList from '../layouts/UserList.vue'
  import UserCardScroller from '../layouts/UserCardScroller.vue'
  import CounterUser from '../layouts/CounterUser.vue'
  import CounterTimer from '../layouts/CounterTimer.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    counterSetting: CounterPreviewType
    count: number | null
    users: UserNameType[]
  }>()

  const componentMap: Record<CounterComponent, any> = {
    counterUser: CounterUser,
    userList: UserList,
    UserCardScroller: UserCardScroller,
    counterTimer: CounterTimer,
  }

  const currentComponent = computed(() => {
    return componentMap[props.counterSetting.component] || CounterUser
  })
</script>
