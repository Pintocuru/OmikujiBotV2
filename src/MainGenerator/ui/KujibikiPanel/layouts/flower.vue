<!-- src/MainGenerator/ui/KujibikiPanel/layouts/flower.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <!-- レターカード -->
    <div class="relative w-xs bg-white rounded-lg shadow-lg border border-[#e8d5c4] overflow-hidden">
      <!-- コンテンツ -->
      <div class="relative p-4 flex flex-col gap-4">
        <!-- タイトル -->
        <div v-if="label" class="flex items-center gap-2 border-b border-[#e8d5c4] pb-3">
          <span class="font-serif text-xl font-medium text-[#8b6b55] tracking-wide">{{ label }}</span>
        </div>

        <!-- 運勢タイトル（slot0） -->
        <div v-if="currentSlot0" class="text-center py-1">
          <span class="font-serif text-4xl font-bold text-[#5d3a28]">
            {{ currentSlot0 }}
          </span>
        </div>

        <!-- メインメッセージ -->
        <div class="flex items-center justify-center">
          <p class="text-lg leading-relaxed text-[#4a3525] text-center break-words">
            {{ currentSlot1 || '--' }}
          </p>
        </div>

        <!-- ユーザー名 -->
        <div v-if="currentName" class="text-right border-t border-dashed border-[#e8d5c4] pt-2">
          <span class="text-[#8b6b55]">{{ currentName }} 様</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/types'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
    label: string
  }>()

  const current = computed(() => props.messages[0])
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)
  const currentSlot1 = computed(() => current.value?.slots?.slot1 ?? null)
</script>
