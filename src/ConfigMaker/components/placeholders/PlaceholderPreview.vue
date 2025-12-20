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
  import Swal from 'sweetalert2'
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
      const placeProcess = new PlaceholderProcessor(placeholdersMap.value)

      placeProcess.updateResolvedValues(DefaultPlaceholdersCommentSchema.parse({}))
      const testPost: PostActionType = PostActionSchema.parse({
        message: { bubble: drawnValue.value.content },
      })

      const processedActions = placeProcess.processPostActions([testPost])

      // 🔥 ここを変更：全 message の bubble / toast を抽出
      const allMessages: string[] = processedActions
        .filter((a) => a.actionType === 'message')
        .flatMap((a) => {
          const msgs: string[] = []
          if (a.message?.bubble) msgs.push(`フキダシ:${a.message.bubble}`)
          if (a.message?.toast) msgs.push(`トースト:${a.message.toast}`)
          return msgs
        })

      // 何もなければ終了
      if (allMessages.length === 0) return

      // 表示用に結合
      processedContent.value = allMessages.join('\n')

      // デバッグ情報
      debugInfo.value = placeProcess.getResolvedValues()

      // 抽選情報
      const weight = drawnValue.value.weight || 1
      const weightPercent = (drawnValue.value as any).weightPercent || 0

      // SweetAlert2 トースト（右下）
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '抽選結果',
        html: `
内容:<br>${processedContent.value.replace(/\n/g, '<br>')}
<br>重み: ${weight}
<br>確率: ${weightPercent.toFixed(2)}%
      `,
        showConfirmButton: false,
        timer: 15000,
        timerProgressBar: true,
      })

      // スピーチ
      postSpeech(processedContent.value)
    } else {
      processedContent.value = ''
      debugInfo.value = {}

      Swal.fire({
        icon: 'error',
        title: '抽選結果',
        text: '抽選できませんでした',
      })
    }
  }
</script>
