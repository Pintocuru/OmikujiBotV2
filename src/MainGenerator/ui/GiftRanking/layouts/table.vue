<!-- src/MainGenerator/ui/GiftRanking/layouts/table.vue -->
<template>
  <div class="p-2 w-full overflow-x-auto">
    <table class="table table-sm w-full">
      <thead>
        <tr class="text-base-content/60">
          <th v-if="show('rank')" class="w-8">#</th>
          <th v-if="show('avatar')" class="w-10"></th>
          <th v-if="show('name')">名前</th>
          <th v-if="show('amount')" class="text-right">金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(message, index) in messages" :key="message.id" class="hover:bg-base-200 transition-colors">
          <td v-if="show('rank')">
            <span
              class="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold"
              :class="rankBadgeClass(index)"
            >
              {{ index + 1 }}
            </span>
          </td>

          <td v-if="show('avatar')">
            <div class="avatar">
              <div class="rounded-full w-7" :class="rankRingClass(index)">
                <img v-if="message.profileImage" :src="message.profileImage" :alt="message.userName" />
                <div
                  v-else
                  class="bg-base-300 text-base-content w-full h-full flex items-center justify-center text-xs font-bold"
                >
                  {{ message.userName?.charAt(0) ?? '?' }}
                </div>
              </div>
            </div>
          </td>

          <td v-if="show('name')" class="text-sm text-base-content max-w-[120px] truncate">
            {{ message.userName }}
          </td>

          <td v-if="show('amount')" class="text-right text-sm font-bold text-primary">
            <span class="text-xs opacity-60">¥</span>{{ formatPrice(message.giftPrice) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { GiftDisplayOption } from '@/types'
  import { GiftLayoutProps } from '../composables/types'
  import { formatPrice, rankRingClass, rankBadgeClass } from '../composables/useRankStyle'

  const props = defineProps<GiftLayoutProps>()
  const show = (key: GiftDisplayOption) => props.displayOptions.includes(key)
</script>
