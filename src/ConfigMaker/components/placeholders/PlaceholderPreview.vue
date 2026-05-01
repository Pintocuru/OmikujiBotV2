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
  import { handelNormalizedValues, WeightValuesArrayType } from '@/types'
  import { processTestPlaceholder } from '@config/components/postAction/preview/TestPlaceholderProcessor'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { addWeightPercentages, drawOmikuji, OmikujiWeightItem } from '@shared/utils/omikuji/DrawOmikuji'
  import { postSpeech } from '@shared/sdk/post/PostOneComme'
  import { Dices } from 'lucide-vue-next'

  const props = defineProps<{
    values: WeightValuesArrayType
  }>()

  const { getCategoryMap } = useGetRecordData()
  const placeholdersMap = computed(() => getCategoryMap('placeholders'))

  // 抽選実行
  const draw = () => {
    const normalized = handelNormalizedValues(props.values)
    const no2 = addWeightPercentages(normalized)
    return drawOmikuji(no2)
  }

  // 結果表示
  const showResult = (drawn: OmikujiWeightItem, message: string) => {
    const { weight = 1, weightPercent = 0 } = drawn

    swalToast.success({
      title: '抽選結果',
      html: `内容:<br>${message}<br>重み: ${weight}<br>確率: ${weightPercent}%`,
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
    showResult(result, message.text)
    postSpeech(message.text)
  }
</script>
