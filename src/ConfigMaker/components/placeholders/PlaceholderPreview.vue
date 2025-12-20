<!-- src/configMaker/components/placeholders/PlaceholderPreview.vue -->
<template>
  <!-- おみくじテストボタン -->
  <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
    <button @click="handleDraw" class="btn btn-info" :disabled="!values.length">
      <Dices class="w-4 h-4" />
      抽選テスト
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {
    DefaultPlaceholdersCommentSchema,
    handelNormalizedValues,
    PlaceholderValueType,
    PostActionSchema,
    PostActionType,
  } from '@/types/'
  import { PlaceholderProcessor } from '@/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
  import { postSpeech } from '@shared/sdk/postMessage/PostOneComme'
  import { toast } from 'vue-sonner'
  import { Dices } from 'lucide-vue-next'

  const props = defineProps<{
    values: (PlaceholderValueType | string)[]
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const placeholdersMap = computed(() => omikujiStore.getCategoryMap('placeholders'))

  // 抽選結果
  const drawnValue = ref<PlaceholderValueType | null>(null)
  const processedContent = ref<string>('')
  const debugInfo = ref<Record<string, string | number>>({})

  const handleDraw = () => {
    // 抽選
    const normalizedValues = handelNormalizedValues(props.values)
    const valuesWithPercent = addWeightPercentages(normalizedValues)
    drawnValue.value = drawOmikuji(valuesWithPercent)

    if (drawnValue.value?.content) {
      // プレースホルダー置換
      const placeProcess = new PlaceholderProcessor(placeholdersMap.value)

      // userなどのデフォルトを入れる
      placeProcess.updateResolvedValues(DefaultPlaceholdersCommentSchema.parse({}))
      const testPost: PostActionType = PostActionSchema.parse({
        message: { bubble: drawnValue.value.content },
      })
      const processedActions = placeProcess.processPostActions([testPost])
      if (processedActions[0].actionType !== 'message') return

      // 結果を取得
      // TODO:processedActions[0] の参照でいいのか？
      processedContent.value = processedActions[0]?.message?.bubble || ''

      // デバッグ情報を取得
      debugInfo.value = placeProcess.getResolvedValues()

      // トーストで結果を表示（15秒間）
      const weight = drawnValue.value.weight || 1
      // ! drawOmikuji で新たなプロパティが付与されてるのでany
      const weightPercent = (drawnValue.value as any).weightPercent || 0

      toast.success('抽選結果', {
        description: `
内容: ${processedContent.value}
重み: ${weight}
確率: ${weightPercent.toFixed(2)}%
    `.trim(),
        duration: 15000, // 15秒間表示
        style: {
          maxWidth: '400px',
          whiteSpace: 'pre-line',
        },
      })
      // 結果をわんコメのスピーチ機能で喋らせる
      postSpeech(processedContent.value)
    } else {
      processedContent.value = ''
      debugInfo.value = {}

      // 抽選結果がない場合のトースト
      toast.error('抽選結果', {
        description: '抽選できませんでした',
        duration: 5000,
      })
    }
  }
</script>
