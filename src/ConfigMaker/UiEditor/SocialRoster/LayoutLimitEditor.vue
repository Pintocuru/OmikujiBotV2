<!-- src/ConfigMaker/UiEditor/SocialRoster/LayoutLimitEditor.vue -->
<template>
  <div class="flex flex-col gap-4">
    <div v-for="field in ['maxRows', 'maxColumns'] as const" :key="field">
      <div class="flex justify-between text-xs mb-1">
        <span>{{ field === 'maxRows' ? '最大行数 (maxRows)' : '最大列数 (maxColumns)' }}</span>
        <span>{{ modelValue[field] ?? '制限なし' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="checkbox"
          :checked="modelValue[field] !== null"
          @change="(e) => toggle(field, (e.target as HTMLInputElement).checked)"
        />
        <input
          type="number"
          min="1"
          class="input input-bordered w-full"
          :disabled="modelValue[field] === null"
          :value="modelValue[field] ?? ''"
          @input="(e) => input(field, (e.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  type LayoutLimit = {
    maxRows: number | null
    maxColumns: number | null
  }

  const props = defineProps<{
    modelValue: LayoutLimit
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: LayoutLimit): void
  }>()

  const toggle = (field: keyof LayoutLimit, checked: boolean) => {
    emit('update:modelValue', { ...props.modelValue, [field]: checked ? 1 : null })
  }

  const input = (field: keyof LayoutLimit, raw: string) => {
    const v = parseInt(raw, 10)
    emit('update:modelValue', { ...props.modelValue, [field]: isNaN(v) ? null : v })
  }
</script>
