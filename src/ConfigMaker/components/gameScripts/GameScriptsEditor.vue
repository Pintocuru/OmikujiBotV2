<!-- src\ConfigMaker\components\gameScripts\GameScriptsEditor.vue -->
<template>
  <template v-if="hasAvailableScripts">
    <!-- ゲームスクリプト有効化トグル -->
    <SettingItem
      label="ゲームスクリプト設定"
      description="複雑なスクリプトを稼働する"
      :variant="isEnabled ? 'secondary' : undefined"
    >
      <label class="label cursor-pointer gap-2">
        <input type="checkbox" :checked="isEnabled" @change="toggleEnabled" class="toggle toggle-primary" />
        <span class="label-text">有効化</span>
      </label>
    </SettingItem>

    <div v-if="isEnabled" class="card p-4 space-y-2 bg-base-200 rounded-lg shadow-lg">
      <SubSectionHeader
        icon="Gamepad2"
        variant="primary"
        title="ゲームスクリプト"
        description="複雑な処理を行うスクリプト設定"
      />

      <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
      <div class="grid grid-cols-3 gap-4 p-4">
        <!-- 左側: プレビューエリア -->
        <div v-if="isEnabled" class="col-span-1 bg-base-300 rounded-lg min-h-[200px]">
          <GameScriptPreview v-if="gameScripts" :gameScripts="gameScripts" />
        </div>

        <!-- 右側: 設定エリア -->
        <div class="space-y-4" :class="isEnabled ? 'col-span-2' : 'col-span-3'">
          <!-- GODMODE の特別表示 -->
          <InformationCard v-if="isGodModeActive">
            <p>
              このおみくじアイテムは、何らかの
              <code class="label bg-accent text-accent-content">特別な設定</code>がされているようです…
            </p>
          </InformationCard>

          <!-- 通常の設定 -->
          <template v-else>
            <!-- 有効時の詳細設定 -->
            <template v-if="isEnabled">
              <!-- Script ID -->
              <SettingItem
                label="スクリプトID"
                description="実行するスクリプトを選択"
                :variant="isScriptIdEmpty ? 'warning' : undefined"
                :showWarning="isScriptIdEmpty"
              >
                <select
                  :value="gameScripts?.scriptId || ''"
                  @change="updateScriptId(($event.target as HTMLSelectElement).value)"
                  class="select select-bordered select-sm w-full"
                >
                  <option value="">-- スクリプトを選択 --</option>
                  <option v-for="scriptKey in availableGameScripts" :key="scriptKey" :value="scriptKey">
                    {{ getScriptName(scriptKey) }}
                  </option>
                  <option v-if="isGod" value="godMode">三 GOD MODE 三</option>
                </select>
              </SettingItem>

              <!-- Script Params -->
              <SettingItem label="スクリプトクエリ" description="スクリプトに渡す追加クエリ">
                <input
                  type="text"
                  :value="gameScripts?.queryString || ''"
                  @input="updateQueryString(($event.target as HTMLInputElement).value)"
                  placeholder="例: mode=スイカ&tlife=3"
                  class="input input-bordered input-sm w-full"
                />
              </SettingItem>

              <!-- Character Key -->
              <SettingItem
                v-if="isCharacter"
                label="キャラクターキー"
                description="スクリプト実行時に使用するキャラクター"
                :variant="isCharacterKeyEmpty ? 'warning' : undefined"
                :showWarning="isCharacterKeyEmpty"
              >
                <select
                  :value="gameScripts?.characterKey || ''"
                  @change="updateCharacterKey(($event.target as HTMLSelectElement).value)"
                  class="select select-bordered select-sm w-full"
                >
                  <option value="">-- キャラクターを選択 --</option>
                  <option v-for="character in charactersList" :key="character.key" :value="character.key">
                    {{ character.name }}
                  </option>
                </select>
              </SettingItem>
            </template>
          </template>
        </div>
      </div>
    </div>
  </template>

  <!-- GODMODE で非GODユーザーの場合 -->
  <InformationCard v-else-if="isGodModeActive">
    <p>
      このおみくじアイテムは、何らかの
      <code class="label bg-accent text-accent-content">特別な設定</code>がされているようです…
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { OmikujiItemType, GameScriptsSchema, RulesCategoryType } from '@/types/OmikujiData/'
  import GameScriptPreview from './GameScriptPreview.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { gameScriptMap } from '@game/GameScriptsMap'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType | null
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const { data, updateOmikujiByIndex } = useOmikujiStore()
  const { getCategoryArray } = useGetRecordData()
  const { isGod } = useSettingMode()
  const { isCharacter } = useVisibilityAccess()

  // Computed Properties
  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji?.key))
  const availableGameScripts = computed(() => data.featureUsage.gameScripts)
  const hasAvailableScripts = computed(() => availableGameScripts.value.length > 0)
  const charactersList = computed(() => getCategoryArray('characters'))
  const gameScripts = computed(() => props.omikuji?.gameScripts)
  const isEnabled = computed(() => gameScripts.value !== null)
  const isGodModeActive = computed(() => !isGod.value && gameScripts.value?.scriptId === 'godMode')
  const isScriptIdEmpty = computed(() => gameScripts.value?.scriptId === '')
  const isCharacterKeyEmpty = computed(() => gameScripts.value?.characterKey === '')

  // Helper Functions
  const getScriptName = (scriptKey: string): string => {
    const script = gameScriptMap[scriptKey]
    return script?.name || scriptKey
  }

  const updateGameScripts = (
    updater: (current: NonNullable<typeof gameScripts.value>) => Partial<NonNullable<typeof gameScripts.value>>
  ) => {
    if (index.value === -1 || !props.selectedItemKey || !gameScripts.value) return

    updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      gameScripts: item.gameScripts
        ? { ...item.gameScripts, ...updater(item.gameScripts) }
        : GameScriptsSchema.parse({}),
    }))
  }

  // Update Functions
  const toggleEnabled = () => {
    if (index.value === -1 || !props.selectedItemKey) return

    updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      gameScripts: item.gameScripts === null ? GameScriptsSchema.parse({}) : null,
    }))
  }

  const updateScriptId = (value: string) => {
    updateGameScripts(() => ({ scriptId: value || '' }))
  }

  const updateCharacterKey = (value: string) => {
    updateGameScripts(() => ({ characterKey: value }))
  }

  const updateQueryString = (value: string) => {
    updateGameScripts(() => ({ queryString: value }))
  }
</script>
