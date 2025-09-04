<!-- src/configMaker/components/comments/CommentRuleEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <!-- ルール編集エリア -->
  <div v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      title="基本設定"
      description="コメントルールの基本的な設定"
    >
      <BaseSettingsEditor v-model="selectedItem" category="comments" />
    </SectionCard>

    <div v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        :isOpen="activeSection === 'threshold'"
        @toggle="toggleSection('threshold')"
        title="発動条件設定"
        description="機能のON/コメントの情報から「おみくじを引く」かどうかを決めます"
      >
        <CommentThresholdEditor v-model="selectedItem.threshold" :selectedRuleId="selectedRuleId" />
      </SectionCard>

      <!-- おみくじ制限設定セクション -->
      <SectionCard
        :isOpen="activeSection === 'limits'"
        @toggle="toggleSection('limits')"
        title="おみくじ制限設定"
        description="重複時や回数超過時におみくじを無効にします"
      >
        <OmikujiLimitsEditor v-model="selectedItem.limits" :selectedRuleId="selectedRuleId" />
      </SectionCard>

      <!-- ゲームスクリプト設定セクション -->
      <SectionCard
        v-if="canShow('gameScriptSettings') || isGod"
        :isOpen="activeSection === 'scriptGame'"
        @toggle="toggleSection('scriptGame')"
        title="ゲームスクリプト設定"
        description="Javascriptを使ったミニゲーム。結果はプレースホルダーの形で出力します"
      >
        <ScriptGameEditor v-model="selectedItem" />
      </SectionCard>

      <!-- おみくじ設定セクション -->
      <SectionCard
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        title="おみくじ設定"
        description="コメントで実行するおみくじの設定"
      >
        <OmikujiSetEditor category="comments" :selectedRuleId="selectedRuleId" />
      </SectionCard>
    </div>

    <!-- 無効のときのメッセージ -->
    <InformationCard v-else variant="error" class="mt-4 p-4">
      現在、このルールは無効になっています。<br />
      編集を行うには、まずルールを有効にしてください。
    </InformationCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CommentRuleType } from '@/types/OmikujiData/RulesSchema'
  import BaseSettingsEditor from '../rules/BaseSettingsEditor.vue'
  import ScriptGameEditor from './GameScriptEditor.vue'
  import OmikujiSetEditor from '../rules/OmikujiSetEditor.vue'
  import OmikujiLimitsEditor from '@/ConfigMaker/components/rulesComments/OmikujiLimitsEditor.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'
  import CommentThresholdEditor from '@ConfigComponents/threshold/ThresholdEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'threshold' | 'limits' | 'scriptGame' | 'omikujiSet' | null
  const activeSection = ref<SectionType>('baseSettings') // 初期状態で基本設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedRuleId } = storeToRefs(omikujiStore)

  const { isGod } = useSettingMode()
  const { canShow } = useVisibilityAccess()

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedRuleId.value) return null
      return data.value.comments[selectedRuleId.value]
    },
    set: (value: CommentRuleType) => {
      omikujiStore.updateItem('comments', value.id, value)
    },
  })
</script>
