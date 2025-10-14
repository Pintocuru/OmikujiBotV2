<!-- src/ConfigMaker/components/meta/PackageDistributionInfo.vue -->
<template>
  <!-- ライセンス -->
  <SettingItem label="ライセンス" description="パッケージのライセンス情報" :showReset="isPro" @reset="resetMap.license">
    <div class="flex gap-2">
      <select
        v-model="license"
        class="select select-bordered flex-1 max-w-xs w-full"
        :class="{ 'select-disabled': !isPro }"
        :disabled="!isPro"
      >
        <option v-for="licenseOption in licenseOptions" :key="licenseOption.value" :value="licenseOption.value">
          {{ licenseOption.label }}
        </option>
      </select>
      <input
        v-if="license === 'custom'"
        v-model="customLicense"
        type="text"
        class="input input-bordered flex-1 max-w-xs"
        :class="{ 'input-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="カスタムライセンスを入力"
      />
    </div>
  </SettingItem>

  <!-- URL -->
  <SettingItem
    label="配布サイトURL"
    description="パッケージの配布サイトやプロジェクトページのURL"
    :showReset="isPro"
    @reset="resetMap.url"
  >
    <div class="flex gap-2">
      <input
        v-model="url"
        type="url"
        class="input input-bordered flex-1 w-full"
        :class="{ 'input-disabled': !isPro }"
        :disabled="!isPro"
        placeholder="https://example.com"
      />
      <button v-if="url && isValidUrl(url)" @click="openUrl" class="btn btn-primary btn-outline" title="サイトを開く">
        <ExternalLink class="w-4 h-4" />
      </button>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { MetaDataSchema } from '@shared/types'
  import { storeToRefs } from 'pinia'
  import { ExternalLink } from 'lucide-vue-next'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  //
  const { isPro } = useSettingMode()

  // ライセンス選択肢(ユーザー向け)
  const licenseOptions = [
    { value: 'CC-BY 4.0', label: 'CC-BY 4.0 (表示)' },
    { value: 'CC-BY-SA 4.0', label: 'CC-BY-SA 4.0 (表示-継承)' },
    { value: 'CC-BY-NC 4.0', label: 'CC-BY-NC 4.0 (表示-非営利)' },
    { value: 'CC-BY-NC-SA 4.0', label: 'CC-BY-NC-SA 4.0 (表示-非営利-継承)' },
    { value: '利用規約に従う', label: '利用規約に従う' },
    { value: 'custom', label: 'カスタム' },
  ]

  // メタデータのプロパティ用computedを生成するヘルパー関数
  const createMetaProperty = <T,>(key: keyof typeof data.value.meta) => {
    return computed({
      get: () => data.value.meta[key] as T,
      set: (value: T) => {
        omikujiStore.updateMeta({
          ...data.value.meta,
          [key]: value,
        })
      },
    })
  }

  // 各プロパティのcomputed
  const license = createMetaProperty<string>('license')
  const url = createMetaProperty<string | undefined>('url')

  // カスタムライセンス用の入力
  const customLicense = computed({
    get: () => {
      if (!licenseOptions.some((option) => option.value === license.value)) {
        return license.value
      }
      return ''
    },
    set: (value: string) => {
      license.value = value
    },
  })

  // URL検証
  const isValidUrl = (urlValue: string | undefined): boolean => {
    if (!urlValue) return false
    try {
      new URL(urlValue)
      return true
    } catch {
      return false
    }
  }

  // URLを開く
  const openUrl = () => {
    if (url.value && isValidUrl(url.value)) {
      window.open(url.value, '_blank', 'noopener,noreferrer')
    }
  }

  // 共通リセット関数
  const resetField = (field: keyof typeof data.value.meta) => {
    let defaultValue

    if (field === 'url') {
      defaultValue = undefined
    } else {
      defaultValue = MetaDataSchema.shape[field].parse(undefined)
    }

    omikujiStore.updateMeta({
      ...data.value.meta,
      [field]: defaultValue,
    })
  }

  // フィールドごとのショートカット
  const resetMap = {
    license: () => resetField('license'),
    url: () => resetField('url'),
  }
</script>
