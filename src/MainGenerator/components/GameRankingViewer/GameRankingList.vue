<!-- src/MainGenerator/components/GameRankingViewer/GameRankingList.vue -->
<template>
  <div v-if="settings" :data-theme="settings.color" class="card p-2 shadow-xl">
    <div class="card-body p-2">
      <h2 class="card-title text-3xl font-bold text-center w-full justify-center">
        {{ settings.title }}
      </h2>

      <div class="space-y-2">
        <div
          v-for="(msg, index) in displayMessages"
          :key="`${msg.id}-${index}`"
          class="flex items-center gap-2 p-2 rounded-lg transition-all hover:bg-base-200"
          :class="getRankClass(index)"
        >
          <!-- スコア順のときだけ順位バッジを表示 -->
          <div v-if="settings.sortOrder === 'high' || settings.sortOrder === 'low'" class="flex-shrink-0">
            <div class="badge badge-xl font-bold" :class="getRankBadgeClass(index)">
              {{ index + 1 }}
            </div>
          </div>

          <!-- 名前 -->
          <div class="flex-grow min-w-0 items-center flex flex-nowrap">
            <!-- アイコン -->
            <div v-if="msg.message.user?.profileImage" class="avatar mr-2">
              <div class="w-10 rounded-full">
                <img :src="msg.message.user?.profileImage" alt="" />
              </div>
            </div>

            <div v-else class="avatar placeholder mr-2">
              <div class="w-10 rounded-full flex items-center justify-center">
                {{ (msg.message.ranking?.listName || msg.message?.user?.name || msg.name || 'A').charAt(0) }}
              </div>
            </div>

            <!-- スコア -->
            <span class="text-xl font-semibold truncate">
              {{ msg.message.ranking?.listName || msg.message?.user?.name || msg.name || 'Anonymous' }}
            </span>
            <span
              v-if="msg.message?.ranking?.symbol !== ''"
              class="text-base text-base-content/60 font-semibold truncate ml-2"
            >
              {{ msg.message?.ranking?.symbol }}
            </span>
          </div>

          <div class="flex-shrink-0">
            <div class="badge badge-xl badge-primary font-bold">
              {{ msg.message?.ranking?.scoreText || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage } from '@/types/MainGenerator/BotMessageSchema'
  import { SettingsRankingType } from '@/types/OmikujiData/ComponentsSchema'
  import { generateDummyMessages } from './useDummyBotMessages'

  const props = defineProps<{
    botMessages: BotMessage[]
    settings: SettingsRankingType
  }>()

  // 表示用メッセージ（空の場合はダミーを生成）
  const displayMessages = computed(() => {
    if (props.botMessages.length > 0) {
      let data = [...props.botMessages].filter((msg) => msg.message?.ranking?.isRank !== false)

      switch (props.settings.sortOrder) {
        case 'high':
          data.sort((a, b) => {
            const diff = (b.message?.ranking?.scoreValue || 0) - (a.message?.ranking?.scoreValue || 0)
            if (diff !== 0) return diff
            return (b.message?.user?.timestamp || 0) - (a.message?.user?.timestamp || 0)
          })
          break
        case 'low':
          data.sort((a, b) => {
            const diff = (a.message?.ranking?.scoreValue || 0) - (b.message?.ranking?.scoreValue || 0)
            if (diff !== 0) return diff
            return (b.message?.user?.timestamp || 0) - (a.message?.user?.timestamp || 0)
          })
          break
        case 'new':
        default:
          data.sort((a, b) => (b.message?.user?.timestamp || 0) - (a.message?.user?.timestamp || 0))
          break
      }

      return data.slice(0, props.settings.limit || 10)
    }

    return generateDummyMessages(props.settings)
  })

  // ランク別のスタイルクラス
  const getRankClass = (index: number): string => {
    if (index === 0) return 'bg-warning/70'
    if (index === 1) return 'bg-info/70'
    if (index === 2) return 'bg-success/70'
    return ''
  }

  // ランク別のバッジクラス
  const getRankBadgeClass = (index: number): string => {
    if (index === 0) return 'badge-warning'
    if (index === 1) return 'badge-info'
    if (index === 2) return 'badge-success'
    return 'badge-ghost'
  }
</script>

<style scoped>
  .card {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
