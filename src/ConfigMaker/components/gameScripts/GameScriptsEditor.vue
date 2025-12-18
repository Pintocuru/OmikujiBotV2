<!-- src\ConfigMaker\components\gameScripts\GameScriptsEditor.vue -->
<template>
  <div v-if="availableGameScripts.length > 0" class="bg-base-200 rounded-lg space-y-3">
    <div class="form-control">
      <SettingItem label="ゲームスクリプト設定" description="複雑なスクリプトを稼働する">
        <label class="label cursor-pointer gap-2">
          <input type="checkbox" :checked="isEnabled" @change="toggleEnabled" class="toggle toggle-primary" />
          <span class="label-text">有効化</span>
        </label>
      </SettingItem>
    </div>

    <div v-if="isEnabled" class="space-y-3">
      <!-- Script ID -->
      <div class="form-control">
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
          </select>
        </SettingItem>
      </div>

      <!-- Script Params -->
      <div class="form-control">
        <SettingItem label="スクリプトパラメータ" description="スクリプトに渡す追加パラメータ(任意)">
          <input
            type="text"
            :value="gameScripts?.scriptParams || ''"
            @input="updateScriptParams(($event.target as HTMLInputElement).value)"
            placeholder="例: speed:fast,color:red"
            class="input input-bordered input-sm w-full"
          />
        </SettingItem>
      </div>

      <!-- Character Key -->
      <div class="form-control">
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
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { gameScriptMap } from '@/common/GameScripts/GameScriptsMap'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

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

  // 共通の更新関数
  const updateOmikujiSets = (updateFn: (sets: OmikujiItemType[], index: number) => OmikujiItemType[]) => {
    if (!props.selectedItemKey) return
    const index = props.allOmikuji.findIndex((item) => item.key === props.omikuji.key)
    if (index === -1) return
    omikujiStore.updateRecordProperty(
      props.category,
      props.selectedItemKey,
      'omikuji',
      updateFn([...props.allOmikuji], index)
    )
  }

  // 有効/無効の切り替え
  const toggleEnabled = () => {
    updateOmikujiSets((sets, index) => {
      if (sets[index].gameScripts === null) {
        // 無効→有効: デフォルト値で初期化
        sets[index] = {
          ...sets[index],
          gameScripts: {
            scriptId: '',
            scriptParams: '',
            characterKey: '',
          },
        }
      } else {
        // 有効→無効: nullに設定
        sets[index] = {
          ...sets[index],
          gameScripts: null,
        }
      }
      return sets
    })
  }

  // scriptId の更新
  const updateScriptId = (value: string) => {
    updateOmikujiSets((sets, index) => {
      if (sets[index].gameScripts) {
        sets[index] = {
          ...sets[index],
          gameScripts: {
            ...sets[index].gameScripts!,
            scriptId: value || '',
          },
        }
      }
      return sets
    })
  }

  // characterKey の更新
  const updateCharacterKey = (value: string) => {
    updateOmikujiSets((sets, index) => {
      if (sets[index].gameScripts) {
        sets[index] = {
          ...sets[index],
          gameScripts: {
            ...sets[index].gameScripts!,
            characterKey: value,
          },
        }
      }
      return sets
    })
  }

  // scriptParams の更新
  const updateScriptParams = (value: string) => {
    updateOmikujiSets((sets, index) => {
      if (sets[index].gameScripts) {
        sets[index] = {
          ...sets[index],
          gameScripts: {
            ...sets[index].gameScripts!,
            scriptParams: value,
          },
        }
      }
      return sets
    })
  }
</script>
