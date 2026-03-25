<!-- src/ConfigMaker/components/common/BaseTagEditor.vue -->
<template>
  <SettingItem label="タグ" description="このデータに関連するタグを追加できます">
    <VueDraggable v-model="localTags" class="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
      <span v-for="(tag, index) in localTags" :key="tag" class="badge badge-sm badge-primary cursor-grab">
        {{ tag }}
        <span class="cursor-pointer ml-1" @click="removeTag(index)">✕</span>
      </span>
    </VueDraggable>

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
  import { ref, watch } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import SettingItem from '@config/components/parts/SettingItem.vue'

  const props = defineProps<{ modelValue?: string[] }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

  const newTag = ref('')
  const localTags = ref<string[]>([...(props.modelValue ?? [])])

  // 親 → ローカル：内容が変わった時だけ同期
  watch(
    () => props.modelValue,
    (val) => {
      const incoming = val ?? []
      if (incoming.length === localTags.value.length && incoming.every((v, i) => v === localTags.value[i])) return
      localTags.value = [...incoming]
    }
  )

  // ローカル → 親：内容が変わった時だけ emit
  watch(localTags, (val) => {
    const current = props.modelValue ?? []
    if (val.length === current.length && val.every((v, i) => v === current[i])) return
    emit('update:modelValue', [...val])
  })

  const addTag = () => {
    const value = newTag.value.trim()
    if (!value) return
    localTags.value = [...localTags.value, value]
    newTag.value = ''
  }

  const removeTag = (index: number) => {
    localTags.value = localTags.value.filter((_, i) => i !== index)
  }
</script>
