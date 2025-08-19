<!-- src/configMaker/components/comments/ThresholdConditionComment.vue -->
<template>
  <div class="form-control bg-base-100 p-3 rounded-lg">
    <SettingItem label="適用するチャットワード" description="正規表現対応。複数指定できます" :show-reset="false">
      <div class="space-y-2">
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
        <div class="text-xs text-base-content/60">各行に1つずつ条件を記入してください。空行は無視されます。</div>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import SettingItem from '@/ConfigMaker/components/parts/SettingItem.vue'

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
    const lines = textValue.value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0) // 空行を除外

    emit('update:modelValue', lines)
  }
</script>
