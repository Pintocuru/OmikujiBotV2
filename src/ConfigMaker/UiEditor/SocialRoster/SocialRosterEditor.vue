<!-- src/ConfigMaker/UiEditor/SocialRoster/SocialRosterEditor.vue -->
<template>
  <!-- プレビュー -->
  <SocialRosterPreview />

  <!-- タイトル -->
  <SettingItem label="タイトル" description="タイトルを設定します" :showReset="true" @reset="resetMap.label">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="socialRoster.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- セルサイズ -->
  <SettingItem
    label="セルサイズ"
    description="アイコンの大きさを指定します"
    :showReset="true"
    @reset="resetMap.cellSize"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in cellSizeLabelMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.cellSize === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('cellSize', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

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

  <!-- ソート順 -->
  <SettingItem label="昇順/降順" description="並び順の方向を指定します">
    <div class="flex flex-wrap gap-2">
      <div
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.sortOrder === 'desc' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('sortOrder', 'desc')"
      >
        降順（多い順）
      </div>
      <div
        class="badge badge-lg cursor-pointer"
        :class="socialRoster.sortOrder === 'asc' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('sortOrder', 'asc')"
      >
        昇順（少ない順）
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

  <!-- テーマカラー -->
  <SettingItem v-if="isAdv" label="テーマカラー" description="テーマカラーを選択" forceMode="adv">
    <select
      class="select select-bordered"
      :value="socialRoster.color"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
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
  import { SettingsSocialSchema, SocialSortKey, StatKeyNum } from '@/types'
  import SocialRosterPreview from './SocialRosterPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const socialRoster = computed(() => data.value.components.settings.socialRoster ?? SettingsSocialSchema.parse({}))
  const rulesComment = computed(() => data.value.comments)

  const { isAdv } = useSettingMode()
  const { isComment } = useVisibilityAccess()

  const updateField = (field: keyof typeof socialRoster.value, value: any) => {
    omikujiStore.updateComponentSettings('socialRoster', {
      ...socialRoster.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof socialRoster.value) => {
    const defaults = SettingsSocialSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    label: () => resetField('label'),
    cellSize: () => resetField('cellSize'),
    sortKey: () => resetField('sortKey'),
    targetEventKey: () => resetField('targetEventKey'),
  }

  const cellSizeLabelMap: Record<string, string> = {
    'h-8': '極小 (32px)',
    'h-10': '小 (40px)',
    'h-12': '中小 (48px)',
    'h-16': '中 (64px)',
    'h-20': '大 (80px)',
    'h-24': '特大 (96px)',
  }

  const sortKeyLabelMap: Record<SocialSortKey, string> = {
    tc: '総チャット数',
    no: '配信内チャット数',
    isSyoken: '初見',
    lastVisit: '最終訪問',
    giftPrice: 'ギフト金額',
  }

  const statKeyLabelMap: Record<StatKeyNum, string> = {
    userName: 'ユーザー名',
    tc: 'チャット数',
    giftPrice: 'ギフト金額',
  }
</script>
