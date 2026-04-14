<!-- src/ConfigMaker/components/appInfo/AppInfoEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- アプリ設定 -->
    <SectionCard
      id="section-appSettings"
      icon="Settings"
      :isOpen="true"
      title="アプリ設定"
      description="このコンフィグエディターに関する設定です"
    >
      <GeneratorSettingsEditor />
      <EditorSettingsEditor />
    </SectionCard>

    <!-- 実績 -->
    <SectionCard
      id="section-appFeatures"
      icon="Sparkles"
      :isOpen="true"
      title="利用可能な機能"
      description="PRO版を使うと機能が増えます"
    >
      <FlagsInfo v-if="!isGod" />
      <FlagsSettings v-else />
    </SectionCard>

    <!-- meta:基本情報 -->
    <SectionCard
      id="section-packageBasic"
      icon="Info"
      variant="neutral"
      :isOpen="true"
      title="基本情報"
      description="このおみくじパッケージに関する情報です"
    >
      <PackageBasicInfo />
    </SectionCard>

    <!-- meta:配布情報 -->
    <SectionCard
      id="section-packageDistribution"
      icon="Package"
      variant="neutral"
      :isOpen="true"
      title="配布情報"
      description="おみくじパッケージのライセンスや配布先の表示です"
    >
      <PackageDistributionInfo />
    </SectionCard>

    <!-- meta:システム情報 -->
    <SectionCard
      id="section-packageSystem"
      icon="Cpu"
      variant="neutral"
      :isOpen="true"
      title="システム情報"
      description="このアプリ「おみくじBOT」の情報です"
    >
      <PackageSystemInfo />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import GeneratorSettingsEditor from './settings/GeneratorSettingsEditor.vue'
  import EditorSettingsEditor from './settings/EditorSettingsEditor.vue'
  import FlagsInfo from './FlagsInfo/FlagsInfo.vue'
  import FlagsSettings from './FlagsSettings/FlagsSettings.vue'
  import PackageBasicInfo from './meta/PackageBasicInfo.vue'
  import PackageDistributionInfo from './meta/PackageDistributionInfo.vue'
  import PackageSystemInfo from './meta/PackageSystemInfo.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

  const { isGod } = useSettingMode()
</script>
