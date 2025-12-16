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
          <div v-if="settings.sortByHighScore" class="flex-shrink-0">
            <div class="badge badge-xl font-bold" :class="getRankBadgeClass(index)">
              {{ index + 1 }}
            </div>
          </div>

          <div class="flex-grow min-w-0">
            <span class="text-xl font-semibold truncate">
              {{ msg.comment?.rankingName || msg.name || 'Anonymous' }}
            </span>
            <span v-if="msg.comment.rankingSymbol !== ''" class="text-lg text-base-content/60 font-semibold truncate">
              {{ msg.comment.rankingSymbol }}
            </span>
          </div>

          <div class="flex-shrink-0">
            <div class="badge badge-xl badge-primary font-bold">
              {{ formatScore(Number(msg.comment?.rankingPoint) || 0) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage, BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
  import { SettingsRankingType } from '@/types/OmikujiData/DisplaySettingsSchema'

  interface Props {
    botMessages: BotMessage[]
    settings: SettingsRankingType
  }

  const props = defineProps<Props>()

  const candidateNames = [
    'てい',
    'ポッピィー',
    'おふとん',
    'もこもこ',
    'じゅん',
    'たかゆき',
    'すいすい',
    'たいよう',
    'ふわみ',
    'いろは',
    'なな',
    'きよし',
    'おとは',
    'こはく',
    'さくら',
  ]

  // ダミーBotMessageを生成
  const generateDummyMessages = (): BotMessage[] => {
    const count = props.settings.limit || 10
    const usedNames = new Set<string>()
    const dummyMessages: BotMessage[] = []

    for (let i = 0; i < count; i++) {
      // 重複しない名前を選択
      let name: string
      do {
        name = candidateNames[Math.floor(Math.random() * candidateNames.length)]
      } while (usedNames.has(name) && usedNames.size < candidateNames.length)

      usedNames.add(name)

      // 3000点から1000点までのランダムスコア
      const points = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000

      dummyMessages.push(
        BotMessageSchema.parse({
          name,
          comment: {
            rankingName: name,
            rankingPoint: String(points),
            rankingRank: String(i + 1),
            rankingKey: props.settings.scriptKey || 'dummy',
          },
        })
      )
    }

    // スコアでソート（降順）
    if (props.settings.sortByHighScore)
      return dummyMessages.sort(
        (a, b) => (Number(b.comment?.rankingPoint) || 0) - (Number(a.comment?.rankingPoint) || 0)
      )
    // ソートせずにそのまま返す
    else return dummyMessages
  }

  // 表示用メッセージ（空の場合はダミーを生成）
  const displayMessages = computed(() => {
    if (props.botMessages.length > 0) {
      let data = [...props.botMessages]

      // rankingIsRank が false のものは除外
      data = data.filter((msg) => msg.comment?.rankingIsRank !== false)

      if (props.settings.sortByHighScore) {
        // スコアでソート（降順）
        data.sort((a, b) => (Number(b.comment?.rankingPoint) || 0) - (Number(a.comment?.rankingPoint) || 0))
      } else {
        // 投稿日時でソート（新しい順）
        data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }

      return data.slice(0, props.settings.limit || 10)
    }
    return generateDummyMessages()
  })

  // スコアのフォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString()
  }

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
