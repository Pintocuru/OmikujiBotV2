<!-- src\ConfigMaker\components\gameScripts\GameScriptsEditor.vue -->
<template>
  <div v-if="availableGameScripts.length > 0" class="">
    <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
    <div class="grid grid-cols-3 gap-4 p-4">
      <!-- 左側: プレビューエリア -->
      <div class="col-span-1 bg-base-300 rounded-lg min-h-[200px]">
        <GameScriptPreview :gameScripts="gameScripts" />
      </div>

      <!-- 右側: 設定エリア -->
      <div class="col-span-2 space-y-4">
        <!-- ゲームスクリプトパッケージカード -->

        <div v-if="isGod || (!isGod && gameScripts?.scriptId !== 'godMode')">
          <SettingItem label="ゲームスクリプト設定" description="複雑なスクリプトを稼働する">
            <label class="label cursor-pointer gap-2">
              <input type="checkbox" :checked="isEnabled" @change="toggleEnabled" class="toggle toggle-primary" />
              <span class="label-text">有効化</span>
            </label>
          </SettingItem>
        </div>

        <!-- GODMODE の設定がある場合 -->
        <div v-if="!isGod && gameScripts?.scriptId === 'godMode'" class="space-y-4">
          <!-- 条件設定の説明 -->
          <InformationCard>
            <p>
              このおみくじアイテムは、何らかの
              <code class="label bg-accent text-accent-content">特別な設定</code>がされているようです…
            </p>
          </InformationCard>
        </div>

        <div v-else-if="isEnabled" class="space-y-4">
          <!-- Script ID -->
          <SettingItem label="スクリプトID" description="実行するスクリプトを選択">
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
              placeholder="例: mode=スイカゲーム&theme=dark"
              class="input input-bordered input-sm w-full"
            />
          </SettingItem>

          <!-- Character Key -->
          <SettingItem label="キャラクターキー" description="スクリプト実行時に使用するキャラクター">
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
        </div>
      </div>
    </div>
  </div>

  <!-- GODMODE の設定がある場合 -->
  <div v-else-if="!isGod && gameScripts?.scriptId === 'godMode'" class="space-y-4">
    <!-- 条件設定の説明 -->
    <InformationCard>
      <p>
        このおみくじアイテムは、何らかの
        <code class="label bg-accent text-accent-content">特別な設定</code>がされているようです…
      </p>
    </InformationCard>
  </div>

  <NoParamsCard v-else :message="'このゲームスクリプトはPRO版で設定できます'" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType, GameScriptsSchema } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { gameScriptMap } from '@/GameScripts/GameScriptsMap'
  import { storeToRefs } from 'pinia'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import GameScriptPreview from './GameScriptPreview.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isGod } = useSettingMode()

  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji.key))

  // 利用可能なゲームスクリプトのキー一覧
  const availableGameScripts = computed(() => data.value.displaySettings.developer.visibility.gameScripts)

  // キャラクター一覧（レコードから配列に変換）
  const charactersList = computed(() => {
    const charactersRecord = data.value.characters
    return Object.values(charactersRecord)
  })

  // スクリプトキーから名前を取得
  const getScriptName = (scriptKey: string): string => {
    const script = gameScriptMap[scriptKey]
    return script?.name || scriptKey
  }

  // 現在のgameScripts
  const gameScripts = computed(() => props.omikuji.gameScripts)

  // 有効/無効の判定
  const isEnabled = computed(() => gameScripts.value !== null)

  // 有効/無効の切り替え
  const toggleEnabled = () => {
    if (index.value === -1 || !props.selectedItemKey) return

    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      gameScripts: item.gameScripts === null ? GameScriptsSchema.parse({}) : null,
    }))
  }

  // scriptId の更新
  const updateScriptId = (value: string) => {
    if (index.value === -1 || !props.selectedItemKey || !props.omikuji.gameScripts) return

    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      gameScripts: item.gameScripts ? { ...item.gameScripts, scriptId: value || '' } : GameScriptsSchema.parse({}),
    }))
  }

  // characterKey の更新
  const updateCharacterKey = (value: string) => {
    if (index.value === -1 || !props.selectedItemKey || !props.omikuji.gameScripts) return

    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      gameScripts: item.gameScripts ? { ...item.gameScripts, characterKey: value } : GameScriptsSchema.parse({}),
    }))
  }

  // queryString の更新
  const updateQueryString = (value: string) => {
    if (index.value === -1 || !props.selectedItemKey || !props.omikuji.gameScripts) return

    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      gameScripts: item.gameScripts ? { ...item.gameScripts, queryString: value } : GameScriptsSchema.parse({}),
    }))
  }
</script>
