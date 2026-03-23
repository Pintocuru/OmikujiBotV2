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
  <SettingItem v-if="requiresValue" label="しきい値" description="条件に使用する値">
    <input
      type="number"
      min="0"
      class="input input-bordered input-sm w-full"
      v-model.number="value"
      placeholder="例：10"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { reactionMap, reactionConditionMap } from '@/types/MetaMaps'
  import { ReactionTriggerType, ReactionReaction } from '@/types/OmikujiData/ReactionTriggerSchema'

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

  // toggle
  const toggleReaction = (key: ReactionReaction) => {
    const set = new Set(reactions.value)
    if (set.has(key)) set.delete(key)
    else set.add(key)
    reactions.value = Array.from(set)
  }

  // ★修正：increasedのみ不要
  const requiresValue = computed(() => comparison.value !== 'increased')
</script>
