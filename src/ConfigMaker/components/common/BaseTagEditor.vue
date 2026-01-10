<!-- src/ConfigMaker/components/common/TagEditor.vue -->
<template>
  <SettingItem label="タグ" description="このデータに関連するタグを追加できます">
    <div class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="(tag, index) in modelValue"
        :key="index"
        class="badge badge-sm badge-primary cursor-pointer"
        @click="removeTag(index)"
      >
        {{ tag }} ✕
      </span>
    </div>

    <div class="flex gap-2">
      <input
        v-model="newTag"
        type="text"
        class="input input-bordered input-sm flex-1"
        placeholder="タグを追加"
        @keyup.enter="addTag"
      />
      <button class="btn btn-sm btn-primary" @click="addTag">追加</button>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'

  const props = defineProps<{
    modelValue?: string[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
  }>()

  const newTag = ref('')

  const addTag = () => {
    const value = newTag.value.trim()
    if (!value) return

    emit('update:modelValue', [...(props.modelValue ?? []), value])
    newTag.value = ''
  }

  const removeTag = (index: number) => {
    emit(
      'update:modelValue',
      (props.modelValue ?? []).filter((_, i) => i !== index)
    )
  }
</script>
