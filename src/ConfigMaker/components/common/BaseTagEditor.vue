<!-- src/ConfigMaker/components/common/TagEditor.vue -->
<template>
  <SettingItem label="タグ" description="このデータに関連するタグを追加できます">
    <div class="flex flex-wrap gap-2 mb-2">
      <VueDraggable v-model="internalValue" itemKey="key" group="tags" class="flex flex-wrap gap-2">
        <template #item="{ element, index }">
          <span class="badge badge-sm badge-primary">
            {{ element }} <span class="cursor-pointer" @click="removeTag(index)">✕</span></span
          >
        </template>
      </VueDraggable>
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
  import { computed, ref } from 'vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  //  import { VueDraggable } from 'vue-VueDraggable-plus'
  import VueDraggable from '@/DraggableWrapper.vue'

  const props = defineProps<{
    modelValue?: string[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
  }>()

  const newTag = ref('')

  const internalValue = computed({
    get: () => props.modelValue ?? [],
    set: (val) => emit('update:modelValue', val),
  })

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
