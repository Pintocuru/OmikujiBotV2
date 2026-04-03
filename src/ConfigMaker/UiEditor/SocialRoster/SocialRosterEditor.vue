<!-- src/ConfigMaker/UiEditor/SocialRoster/SocialRosterEditor.vue -->
<template>
  <!-- プレビュー -->
  <SocialRosterPreview />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="socialRoster.component"
    :options="socialComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- テーマカラー -->
  <DaisyUiThemeEditor
    v-if="isAdv && socialComponentMap[socialRoster.component].isColor"
    :model-value="socialRoster.color"
    @update:model-value="(newValue) => updateField('color', newValue)"
  />

  <!-- ソート基準 -->
  <SettingItem
    label="右下のステータス"
    description="アイコンの右下に表示する内容"
    :showReset="true"
    @reset="resetMap.sortKey"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in socialSortKeyMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.sortKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('sortKey', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- 対象イベントキー -->
  <SettingItem
    v-if="isComment"
    label="対象イベントキー"
    description="対象とするイベントを指定します"
    :showReset="true"
    @reset="resetMap.targetEventKey"
  >
    <div class="flex flex-wrap gap-2">
      <div
        class="badge cursor-pointer"
        :class="socialRoster.targetEventKey === '' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', '')"
      >
        すべて
      </div>
      <div
        v-for="(value, key) in rulesComment"
        :key="key"
        class="badge cursor-pointer"
        :class="socialRoster.targetEventKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', key)"
      >
        {{ value.name || '名称未設定' }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { socialComponentMap, SocialRosterSchema, socialSortKeyMap } from '@/types'
  import SocialRosterPreview from './SocialRosterPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const socialRoster = computed(() => data.value.components.settings.socialRoster ?? SocialRosterSchema.parse({}))
  const rulesComment = computed(() => data.value.comments)

  const { isAdv, isPro } = useSettingMode()
  const { isComment } = useVisibilityAccess()

  const updateField = (field: keyof typeof socialRoster.value, value: any) => {
    omikujiStore.updateComponentSettings('socialRoster', {
      ...socialRoster.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof socialRoster.value) => {
    const defaults = SocialRosterSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    sortKey: () => resetField('sortKey'),
    targetEventKey: () => resetField('targetEventKey'),
  }
</script>
