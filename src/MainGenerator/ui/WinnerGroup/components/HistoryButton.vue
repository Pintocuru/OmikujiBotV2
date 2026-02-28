<!-- src/MainGenerator/ui/WinnerGroup/components/HistoryButton.vue -->
<template>
  <div class="fixed top-4 right-4 z-50" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- 履歴ボタン -->
    <button
      class="btn btn-circle btn-sm transition-all duration-300"
      :class="[isHovered || showHistory ? 'btn-primary opacity-100' : 'btn-ghost opacity-0']"
      @click="toggleHistory"
    >
      <Clock class="w-5 h-5" />
    </button>

    <!-- 履歴パネル -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="showHistory" class="absolute top-12 right-0 w-128 max-h-48 overflow-y-auto">
        <div class="card bg-base-200/95 backdrop-blur-md shadow-xl border border-base-300">
          <div class="card-body p-4">
            <h3 class="card-title text-sm mb-2 flex items-center gap-2">
              <History class="w-4 h-4" />
              履歴（最新10件）
            </h3>

            <div v-if="historyItems.length === 0" class="text-sm opacity-60 text-center py-4">
              <FileQuestion class="w-8 h-8 mx-auto mb-2 opacity-40" />
              まだ履歴がありません
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in historyItems"
                :key="item.id"
                class="p-2 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors text-xs"
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="font-bold opacity-70 flex items-center gap-1">
                    <Hash class="w-3 h-3" />
                    {{ historyItems.length - index }}
                  </span>
                  <span class="opacity-50 flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    {{ formatTimestamp(item.timestamp) }}
                  </span>
                </div>

                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(user, idx) in item.users"
                    :key="idx"
                    class="badge badge-sm gap-1"
                    :class="`badge-${color}`"
                  >
                    <User class="w-3 h-3" />
                    {{ user.userName }}
                  </span>
                </div>
              </div>
            </div>

            <button v-if="historyItems.length > 0" class="btn btn-sm btn-ghost mt-2 gap-2" @click="clearHistory">
              <Trash2 class="w-4 h-4" />
              履歴をクリア
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { UserNameType } from '@shared/types'
  import { Clock, History, Hash, User, Trash2, FileQuestion } from 'lucide-vue-next'

  interface HistoryItem {
    id: string
    timestamp: string
    users: UserNameType[]
  }

  defineProps<{
    historyItems: HistoryItem[]
    color?: string
  }>()

  const emit = defineEmits<{
    toggle: []
    clear: []
  }>()

  const isHovered = ref(false)
  const showHistory = ref(false)

  const toggleHistory = () => {
    showHistory.value = !showHistory.value
    emit('toggle')
  }

  const clearHistory = () => {
    emit('clear')
    showHistory.value = false
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)

    if (diffSec < 60) return `${diffSec}秒前`
    if (diffMin < 60) return `${diffMin}分前`
    if (diffHour < 24) return `${diffHour}時間前`

    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  }
</script>

<style scoped>
  /* スムーズなスクロールバー */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
</style>
