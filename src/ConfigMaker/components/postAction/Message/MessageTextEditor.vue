<!-- src/ConfigMaker/components/postAction/Message/MessageTextEditor.vue -->
<template>
  <div class="relative w-full">
    <!-- input -->
    <input
      v-model="model"
      type="text"
      class="input input-bordered input-sm w-full pr-10"
      :placeholder="placeholder"
      :class="{ hidden: isTextarea }"
    />

    <!-- textarea -->
    <textarea
      v-model="model"
      :rows="rows"
      class="textarea textarea-bordered textarea-sm w-full pr-10"
      :placeholder="placeholder"
      :class="{ hidden: !isTextarea }"
    ></textarea>

    <!-- toggle -->
    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
      @click="isTextarea = !isTextarea"
    >
      <AlignLeft v-if="!isTextarea" class="w-4 h-4" />
      <AlignJustify v-else class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { AlignLeft, AlignJustify } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      modelValue: string
      placeholder?: string
      rows?: number
    }>(),
    {
      placeholder: 'メッセージを入力',
      rows: 3,
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const isTextarea = ref(true)

  const model = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })
</script>
