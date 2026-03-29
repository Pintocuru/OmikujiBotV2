<!-- src/ConfigMaker/UiEditor/SocialRoster/SocialRosterEditor.vue -->
<template>
  <!-- プレビュー -->
  <SocialRosterPreview />

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(value, key) in socialComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="socialRoster.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ value.label }}
      </div>
    </div>
  </SettingItem>

  <!-- テーマカラー -->
  <DaisyUiThemeEditor
    v-if="isAdv && socialComponentMap[socialRoster.component].isColor"
    :model-value="socialRoster.color"
    @update:model-value="(newValue) => updateField('color', newValue)"
  />

  <!-- ソート基準 -->
  <SettingItem label="並び順" description="ユーザーの表示順を指定します" :showReset="true" @reset="resetMap.sortKey">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in sortKeyLabelMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.sortKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('sortKey', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- 右下のステータス -->
  <SettingItem label="右下のステータス" description="アイコンの右下に表示する内容">
    <div class="flex flex-wrap gap-2">
      <div
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.statKey === null ? 'badge-primary' : 'badge-outline'"
        @click="updateField('statKey', null)"
      >
        非表示
      </div>
      <div
        v-for="(label, key) in statKeyLabelMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.statKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('statKey', key)"
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
  import { socialComponentMap, SocialRosterSchema, SocialSortKey, StatKeyNum } from '@/types'
  import SocialRosterPreview from './SocialRosterPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'

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

  const sortKeyLabelMap: Record<SocialSortKey, string> = {
    lastVisit: '最終訪問',
    giftPrice: 'ギフト金額',
    no: '配信内チャット数',
    tc: '総チャット数',
    isSyoken: '初見',
  }

  const statKeyLabelMap: Record<StatKeyNum, string> = {
    userName: 'ユーザー名',
    tc: 'チャット数',
    giftPrice: 'ギフト金額',
  }
</script>
