<!-- src/ConfigMaker/components/placeholders/PlaceholderPreview.vue -->
<template>
  <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
    <button @click="handleDraw" class="btn btn-info" :disabled="!values.length">
      <Dices class="w-4 h-4" />
      抽選テスト
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { handelNormalizedValues, WeightValuesArrayType, WeightValueType } from '@/types/'
  import { processTestPlaceholder } from '@config/components/postAction/preview/TestPlaceholderProcessor'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
  import { postSpeech } from '@shared/sdk/postMessage/PostOneComme'
  import { Dices } from 'lucide-vue-next'

  const props = defineProps<{
    values: WeightValuesArrayType
  }>()

  const { getCategoryMap } = useGetRecordData()
  const placeholdersMap = computed(() => getCategoryMap('placeholders'))

  // 抽選実行
  const draw = () => {
    const normalized = handelNormalizedValues(props.values)
    return drawOmikuji(normalized)
  }

  // 結果表示
  const showResult = (drawn: WeightValueType, message: string) => {
    const { weight = 1, weightPercent = 0 } = drawn as any

    swalToast.success({
      title: '抽選結果',
      html: `内容:<br>${message}<br>重み: ${weight}<br>確率: ${weightPercent.toFixed(2)}%`,
      timer: 15000,
    })
  }

  const showError = () => {
    swalToast.error({ title: '抽選結果', text: '抽選できませんでした' })
  }

  // メイン処理
  const handleDraw = () => {
    const result = draw()
    if (!result?.content) return showError()

    const message = processTestPlaceholder(result.content, placeholdersMap.value)
    showResult(result, message)
    postSpeech(message)
  }
</script>
