<!-- src/MainGenerator/ui/GameRanking/layouts/RankStandard/GameRankingList.vue -->
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
            <div class="avatar mr-1">
              <div class="w-7 rounded-full">
                <img
                  :src="msg.user?.profileImage || getAvatarUrl(msg.user?.userName ?? 'Anonymous')"
                  class="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>

            <!-- 名前 -->
            <span class="text-lg font-bold truncate">
              {{ msg.lists?.listName || msg.user?.userName || 'Anonymous' }}
            </span>
            <!-- symbol -->
            <span v-if="msg.lists?.symbol !== ''" class="text-base text-base-content/60 font-semibold truncate ml-2">
              {{ msg.lists?.symbol }}
            </span>
          </div>

          <!--スコア -->
          <div class="flex-shrink-0">
            <div class="badge badge-lg p-2 font-bold" :class="scoreBadgeClass(msg.lists?.variant)">
              {{ msg.lists?.text || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
  import { generateDummyMessages } from '@/common/MockUser/MockGenerators'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'
  import { GameRankingType } from '@/types/OmikujiData'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  const props = defineProps<{
    listMessages: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  // 表示用メッセージ（空の場合はダミーを生成）
  const displayMessages = computed(() => {
    if (props.listMessages.length > 0) {
      let data = [...props.listMessages].filter((msg) => msg.lists?.isVisible !== false)

      switch (props.settings.sortOrder) {
        case 'high':
          data.sort((a, b) => {
            const diff = (b.lists?.order || 0) - (a.lists?.order || 0)
            if (diff !== 0) return diff
            return (b.user?.timestamp || 0) - (a.user?.timestamp || 0)
          })
          break
        case 'low':
          data.sort((a, b) => {
            const diff = (a.lists?.order || 0) - (b.lists?.order || 0)
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
  const scoreBadgeClass = (variant?: DaisyUIColorType): string => {
    return variant ? `badge-${variant}` : 'badge-primary'
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
