<!-- src/configMaker/components/comments/GameScriptEditor.vue -->
<template>
  <!-- ゲームスクリプトによる追加の要素 -->
  <div v-if="selectedScript" class="space-y-4">
    <!-- 追加のプレースホルダー -->
    <div class="form-control bg-base-100 p-3 rounded-lg space-y-4">
      <h3 class="font-semibold border-b pb-1">使用可能な追加のプレースホルダー</h3>
      <PlaceholderList :editorColor="selectedScript.editorColor" />
    </div>
    <!-- 追加のWordPartyの演出 -->
    <div v-if="selectedScript">
      <div class="form-control bg-base-200 p-2 rounded-lg">
        <h3 class="font-semibold border-b">GameScripts で追加されるアクション</h3>
        <PostActionsPreview :actions="selectedScript.postActions as PostActionType[]" />
      </div>
    </div>
  </div>

  <!-- ゲームスクリプトの説明 -->
  <div v-else>
    <InformationCard class="mb-4">
      <p>
        <code class="label bg-accent text-accent-content">ゲームスクリプト</code
        >とは、複雑なおみくじ処理を実行するための機能です。
      </p>
      <p>
        ゲームの結果は、<code class="label bg-accent text-accent-content">プレースホルダー</code>として出力されます。
      </p>
      <p>
        下記の<code class="label bg-accent text-accent-content">ゲームスクリプト</code>を選択すると、<code
          class="label bg-accent text-accent-content"
          >ゲームスクリプト専用のプレースホルダー</code
        >が表示されます。
      </p>
    </InformationCard>
  </div>

  <!-- スクリプト選択とパラメータ設定 -->
  <div v-if="isScriptEnabled" class="space-y-4">
    <!-- スクリプト選択 -->
    <SettingItem label="ゲームスクリプト" description="ゲーム結果は、おみくじ設定＞プレースホルダーから">
      <select
        :disabled="!data.displaySettings.developer.visibility.gameScriptSettings"
        v-model="scriptId"
        class="select select-bordered w-full"
      >
        <option value="">スクリプトを選択してください</option>
        <option v-for="(script, id) in enabledGameScriptMap" :key="id" :value="script.key">
          {{ script.name }}
        </option>
      </select>
    </SettingItem>

    <!-- スクリプト設定パラメータ -->
    <div v-if="selectedScript?.params?.length">
      <SettingItem
        v-for="setting in selectedScript.params"
        :key="setting.key"
        :label="setting.name"
        :description="setting.description"
        :showReset="true"
        @reset="resetParam(setting.key, setting.defaultValue)"
      >
        <!-- 文字列入力 -->
        <input
          v-if="setting.inputType === 'string'"
          :disabled="!data.displaySettings.developer.visibility.gameScriptSettings"
          type="text"
          v-model="scriptParams[setting.key]"
          class="input input-bordered w-full"
          :placeholder="setting.description || ''"
        />

        <!-- 数値入力 -->
        <input
          v-else-if="setting.inputType === 'number'"
          :disabled="!data.displaySettings.developer.visibility.gameScriptSettings"
          type="number"
          v-model.number="scriptParams[setting.key]"
          :min="setting.min"
          :max="setting.max"
          class="input input-bordered w-full"
        />

        <!-- セレクト -->
        <select
          v-else-if="setting.inputType === 'select'"
          :disabled="!data.displaySettings.developer.visibility.gameScriptSettings"
          v-model="scriptParams[setting.key]"
          class="select select-bordered w-full"
        >
          <option v-for="(option, index) in setting.values" :key="index" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- ブール値（チェックボックス） -->
        <div v-else-if="setting.inputType === 'boolean'" class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" v-model="scriptParams[setting.key]" class="checkbox checkbox-primary" />
            <span class="label-text">有効</span>
          </label>
        </div>
      </SettingItem>
    </div>

    <!-- スクリプトのパラメータがない場合 -->
    <div v-else-if="selectedScript && selectedScript?.params?.length <= 0">
      <NoParamsCard message="このスクリプトには設定可能なパラメータがありません" iconName="LucidePackageOpen" />
    </div>

    <!-- スクリプトが選択されていない場合 -->
    <div v-else>
      <NoParamsCard message="スクリプトが選択されていません" iconName="LucideFileX" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CommentRuleType, PostActionType, ScriptPreset, createScriptParamsSchema } from '@/types/'
  import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useEnabledGames } from '../GameScripts/useEnabledGames'
  import PlaceholderList from '@ConfigComponents/placeholders/PlaceholderList.vue'
  import PostActionsPreview from '@ConfigComponents/postAction/PostActionsPreview.vue'
  import { DefaultTypes } from '@shared/types'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    modelValue: CommentRuleType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CommentRuleType]
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { enabledGameScriptMap } = useEnabledGames()

  // スクリプト有効化フラグ
  const isScriptEnabled = computed({
    get: () => enabledGameScriptMap.value.length > 0,
    set: (enabled: boolean) => {
      if (enabled) {
        emit('update:modelValue', {
          ...props.modelValue,
          scriptId: '',
          scriptParams: {},
        })
      } else {
        emit('update:modelValue', {
          ...props.modelValue,
          scriptId: null,
          scriptParams: null,
        })
      }
    },
  })

  // スクリプトID
  const scriptId = computed({
    get: () => props.modelValue.scriptId || '',
    set: (newScriptId: string) => {
      const finalScriptId = newScriptId === '' ? null : newScriptId
      let defaultParams: DefaultTypes = {}

      if (finalScriptId) {
        const schema = createScriptParamsSchema(finalScriptId, gameScriptMap)
        defaultParams = schema.parse({}) as DefaultTypes
      }

      emit('update:modelValue', {
        ...props.modelValue,
        scriptId: finalScriptId,
        scriptParams: defaultParams,
      })
    },
  })

  // 選択されたスクリプト
  const selectedScript = computed((): ScriptPreset | null => {
    if (!props.modelValue.scriptId) return null
    return gameScriptMap[props.modelValue.scriptId] || null
  })

  // スクリプトパラメータの双方向バインディング
  const scriptParams = computed({
    get: () => props.modelValue.scriptParams || {},
    set: (newParams: Record<string, any>) => {
      emit('update:modelValue', {
        ...props.modelValue,
        scriptParams: newParams,
      })
    },
  })

  // パラメータリセット
  const resetParam = (paramId: string, defaultValue: any) => {
    const currentParams = { ...scriptParams.value }
    currentParams[paramId] = defaultValue
    scriptParams.value = currentParams
  }
</script>
