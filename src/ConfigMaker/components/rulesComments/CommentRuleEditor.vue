<!-- src/ConfigMaker/components/rulesComments/CommentRuleEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <!-- 全体キャラ変更 -->
    <GlobalCharacterChanger category="comments" />
  </div>

  <!-- タブ部分 -->
  <RecordTabs />

  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      icon="SlidersHorizontal"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :description="selectedItem.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="comments" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        icon="Filter"
        :isOpen="activeSection === 'threshold'"
        @toggle="toggleSection('threshold')"
        title="発動条件設定"
        :subTitle="`発動条件: ${thresholdSubTitle}`"
        description="「おみくじを引く」発動条件の設定"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ制限設定セクション -->
      <SectionCard
        icon="Timer"
        :isOpen="activeSection === 'limits'"
        @toggle="toggleSection('limits')"
        :title="`おみくじ制限設定`"
        :subTitle="limitsSubTitle"
        description="重複時や回数超過時におみくじを無効にします"
      >
        <OmikujiLimitsEditor v-model="selectedItem.limits" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ設定セクション -->
      <SectionCard
        icon="ListChecks"
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        title="おみくじ設定"
        :subTitle="`(おみくじの数 : ${selectedItem.omikuji.length})`"
        description="コメントで実行するおみくじの設定"
      >
        <OmikujiSetEditor category="comments" :selectedItemKey="selectedItemKey" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <InformationCard v-else variant="error" class="mt-4 p-4">
      現在、このイベントは無効になっています。<br />
      編集を行うには、まずイベントを有効にしてください。
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CommentRuleType } from '@/types/OmikujiData/'
  import CommentTriggerEditor from './CommentTriggerEditor.vue'
  import OmikujiLimitsEditor from './OmikujiLimitsEditor.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import OmikujiSetEditor from '@config/components/rules/OmikujiSetEditor.vue'
  import GlobalCharacterChanger from '@config/components/rules/CharacterChanger/CharacterChanger.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'threshold' | 'limits' | 'scriptGame' | 'omikujiSet' | null
  const activeSection = ref<SectionType>('omikujiSet')

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()
  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('comments', selectedItemKey.value)
    },
    set: (value: CommentRuleType) => {
      updateItem('comments', value.key, value)
    },
  })

  // 発動条件セクションのサブタイトル
  const thresholdSubTitle = computed(() => {
    if (!selectedItem.value) return ''

    const conditions = selectedItem.value.trigger.conditions
    const icons = []

    if (conditions.includes('username')) icons.push('[👱 ユーザー名]')
    if (conditions.includes('access')) icons.push('[🚶 ユーザーの役職]')
    if (conditions.includes('comment')) icons.push('[💬 チャットワード]')
    if (conditions.includes('gift')) icons.push('[🎁 ギフト]')
    if (!icons.length) return '[すべてのコメント]'

    return icons.join('')
  })

  const limitsSubTitle = computed(() => {
    const limits = selectedItem.value?.limits
    if (!limits) return ''

    const isCooldownDisabled = limits.cooldownSeconds === 0
    const isRepeatDisabled = limits.isRepeatAllowed === 0

    // どちらも無効なら「無効」と表示
    if (isCooldownDisabled && isRepeatDisabled) {
      return '（制限: 無効）'
    }

    // どちらか有効なら詳細表示
    const cool = `cool:${limits.cooldownSeconds}s`
    const repeat = limits.isRepeatAllowed === 0 ? '連投:無制限' : `連投:${limits.isRepeatAllowed}回まで可`

    return `(${cool}, ${repeat})`
  })
</script>
