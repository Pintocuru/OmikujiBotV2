<!-- src/ConfigMaker/components/eventsReaction/ReactionTriggerEditor.vue -->
<template>
  <!-- リアクション選択 -->
  <SettingItem label="対象リアクション" description="監視するリアクションを選択（複数可）">
    <div class="flex flex-wrap gap-2">
      <label v-for="(label, key) in reactionMap.youtube" :key="key" class="cursor-pointer">
        <input type="checkbox" class="hidden" :checked="reactions.includes(key)" @change="toggleReaction(key)" />
        <span class="badge badge-lg select-none" :class="reactions.includes(key) ? 'badge-primary' : 'badge-ghost'">
          {{ label }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 条件 -->
  <SettingItem label="発動条件" description="リアクションの変化条件">
    <select class="select select-bordered select-sm w-full" v-model="comparison">
      <option v-for="(v, key) in reactionConditionMap" :key="key" :value="key">
        {{ v.label }}
      </option>
    </select>

    <!-- 説明 -->
    <p class="text-xs opacity-70 mt-1">
      {{ reactionConditionMap[comparison].description }}
    </p>
  </SettingItem>

  <!-- 数値指定 -->
  <SettingItem label="しきい値" description="条件に使用する値">
    <input
      type="number"
      min="0"
      class="input input-bordered input-sm w-full"
      v-model.number="value"
      placeholder="例：10"
    />
  </SettingItem>

  <!-- レベルでの発動 -->
  <SettingItem v-if="comparison !== 'milestone'" label="レベルでの発動" :description="`リアクションが押される量で発動`">
    <div class="w-full space-y-2">
      <!-- スライダー -->
      <input
        type="range"
        min="0"
        max="3"
        step="1"
        class="range w-full"
        :class="rangeClassMap[triggerLevel]"
        v-model.number="triggerLevel"
      />

      <!-- アイコン表示 -->
      <div class="flex justify-between items-center px-1">
        <component
          v-for="(Icon, i) in icons"
          :key="i"
          :is="Icon"
          class="w-4 h-4"
          :class="i === triggerLevel ? 'opacity-100 scale-110' : 'opacity-20'"
        />
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { reactionMap, reactionConditionMap } from '@/types/MetaMaps'
  import { ReactionTriggerType, ReactionReaction } from '@/types/OmikujiData/ReactionTriggerSchema'
  import { VolumeX, Volume2, Dot } from 'lucide-vue-next'

  const props = defineProps<{
    modelValue: ReactionTriggerType
    selectedItemKey: string | null
  }>()

  const { updateRecordProperty } = useOmikujiStore()

  const createComputed = <T extends keyof ReactionTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateRecordProperty('reactions', props.selectedItemKey, 'trigger', updated)
      },
    })

  const reactions = createComputed('reactions')
  const comparison = createComputed('comparison')
  const value = createComputed('value')
  const triggerLevel = createComputed('triggerLevel')

  // toggle
  const toggleReaction = (key: ReactionReaction) => {
    const set = new Set(reactions.value)
    if (set.has(key)) set.delete(key)
    else set.add(key)
    reactions.value = Array.from(set)
  }

  const icons = [VolumeX, Dot, Dot, Volume2]
  const rangeClassMap = ['', 'range-success', 'range-warning', 'range-error'] as const
</script>
