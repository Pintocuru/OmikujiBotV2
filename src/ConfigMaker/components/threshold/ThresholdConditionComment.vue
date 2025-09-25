<!-- src/configMaker/components/comments/ThresholdConditionComment.vue -->
<template>
  <SettingItem label="適用するチャットワード" description="正規表現対応。改行で複数指定できます">
    <textarea
      v-model="textValue"
      @input="updateModelValue"
      placeholder="例:
^こんにちは|おはよう$
テスト.*
^ありがとう"
      class="textarea textarea-bordered w-full min-h-[120px]"
      rows="6"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  const props = defineProps<{ modelValue: string[] }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

  // textarea用の文字列値
  const textValue = ref('')

  // 初期値設定
  textValue.value = props.modelValue.join('\n')

  // propsが変更された時にtextValueを更新
  watch(
    () => props.modelValue,
    (newValue) => {
      const newText = newValue.join('\n')
      if (textValue.value !== newText) {
        textValue.value = newText
      }
    }
  )

  // textareaの値が変更された時にmodelValueを更新
  const updateModelValue = () => {
    const lines = textValue.value.split('\n')
    emit('update:modelValue', lines)
  }
</script>
