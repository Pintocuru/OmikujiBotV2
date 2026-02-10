<!-- src/MainGenerator/components/GameRankingViewer/GameRankingList.vue -->
<template>
  <div v-if="settings" :data-theme="settings.color" class="card shadow-xl">
    <div class="card-body p-2">
      <h2 class="card-title text-xl font-bold text-center w-full justify-center">
        {{ settings.title }}
      </h2>

      <div class="space-y-1">
        <div
          v-for="(msg, index) in displayMessages"
          :key="`${msg.id}-${index}`"
          class="flex items-center gap-1 p-1 rounded-lg transition-all hover:bg-base-200"
          :class="getRankClass(index)"
        >
          <!-- スコア順のときだけ順位バッジを表示 -->
          <div v-if="settings.sortOrder === 'high' || settings.sortOrder === 'low'" class="flex-shrink-0">
            <div class="badge ml-1 p-2 font-bold" :class="getRankBadgeClass(index)">
              {{ index + 1 }}
            </div>
          </div>

          <!-- 名前 -->
          <div class="flex-grow min-w-0 items-center flex flex-nowrap">
            <!-- アイコン -->
            <div v-if="msg.user?.profileImage" class="avatar mr-1">
              <div class="w-7 rounded-full">
                <img :src="msg.user?.profileImage" alt="" />
              </div>
            </div>
            <!-- アイコン(ないとき) -->
            <div v-else class="avatar placeholder mr-1">
              <div class="bg-neutral text-neutral-content w-7 rounded-full flex items-center justify-center">
                {{ (msg.ranking?.listName || msg.user?.userName || 'A').charAt(0) }}
              </div>
            </div>

            <!-- 名前 -->
            <span class="text-lg font-bold truncate">
              {{ msg.ranking?.listName || msg.user?.userName || 'Anonymous' }}
            </span>
            <!-- symbol -->
            <span v-if="msg.ranking?.symbol !== ''" class="text-base text-base-content/60 font-semibold truncate ml-2">
              {{ msg.ranking?.symbol }}
            </span>
          </div>

          <!--スコア -->
          <div class="flex-shrink-0">
            <div class="badge badge-lg p-2 font-bold" :class="scoreBadgeClass(msg.ranking?.variant as BaseVariant)">
              {{ msg.ranking?.scoreText || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageRankingType } from '@/types/MainGenerator/BotMessageSchema'
  import { generateDummyMessages } from '../../useDummyBotMessages'
  import { BaseVariant } from '@shared/components/parts/ItemVariantTypes'
  import { SettingsRankingType } from '@/types/OmikujiData'

  const props = defineProps<{
    listMessages: BotMessageRankingType[]
    settings: SettingsRankingType
  }>()

  // 表示用メッセージ（空の場合はダミーを生成）
  const displayMessages = computed(() => {
    if (props.listMessages.length > 0) {
      let data = [...props.listMessages].filter((msg) => msg.ranking?.isRank !== false)

      switch (props.settings.sortOrder) {
        case 'high':
          data.sort((a, b) => {
            const diff = (b.ranking?.scoreValue || 0) - (a.ranking?.scoreValue || 0)
            if (diff !== 0) return diff
            return (b.user?.timestamp || 0) - (a.user?.timestamp || 0)
          })
          break
        case 'low':
          data.sort((a, b) => {
            const diff = (a.ranking?.scoreValue || 0) - (b.ranking?.scoreValue || 0)
            if (diff !== 0) return diff
            return (b.user?.timestamp || 0) - (a.user?.timestamp || 0)
          })
          break
        case 'new':
        default:
          data.sort((a, b) => (b.user?.timestamp || 0) - (a.user?.timestamp || 0))
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

  // スコアのカラー
  const scoreBadgeClass = (variant?: BaseVariant): string => {
    switch (variant) {
      case 'primary':
        return 'badge-primary'
      case 'secondary':
        return 'badge-secondary'
      case 'accent':
        return 'badge-accent'
      case 'info':
        return 'badge-info'
      case 'success':
        return 'badge-success'
      case 'warning':
        return 'badge-warning'
      case 'error':
        return 'badge-error'
      case 'neutral':
        return 'badge-neutral'
      case 'none':
        return ''
      default:
        return 'badge-primary'
    }
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
