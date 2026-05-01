<!-- src/ConfigMaker/UiEditor/KujibikiPanel/KujibikiPanelPreview.vue -->
<template>
  <HudPreview maxHeightClass="h-[440px]">
    <KujibikiPanelSelector :settings="settings" :messages="activeMessages" />

    <template #hud>
      <button class="btn btn-xs btn-ghost" @click="hoge">🎲</button>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { BotMessageBubbleType, KujibikiPanelType } from '@/types'
  import KujibikiPanelSelector from '@main/ui/KujibikiPanel/parts/KujibikiPanelSelector.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'

  const props = defineProps<{
    settings: KujibikiPanelType
  }>()

  const mockData = [
    { slot0: '大吉', message: '運気は上昇の一途。思い切った行動が吉と出るでしょう。', name: 'さくらさん' },
    { slot0: '中吉', message: '焦らず着実に進むことで道が開けます。', name: 'たろうさん' },
    { slot0: '小吉', message: '小さな幸せを大切に。身近なところに喜びが隠れています。', name: 'はなこさん' },
    {
      slot0: '吉',
      message: '今は種まきの時期。丁寧に取り組む姿勢が後の大きな実りへと繋がります。',
      name: 'けんじさん',
    },
    { slot0: '末吉', message: '焦りは禁物。じっくりと準備を整えれば、必ず好転の兆しが訪れます。', name: 'みきさん' },
    { slot0: '凶', message: '今は嵐の前の静けさ。無理に動かず、内側を整える時期と捉えましょう。', name: 'りくさん' },
  ]

  const currentIndex = ref(0)

  const activeMessages = computed<BotMessageBubbleType[]>(() => {
    const entry = mockData[currentIndex.value % mockData.length]
    return [
      {
        id: `mock-${currentIndex.value}`,
        type: 'comment',
        timestamp: new Date().toISOString(),
        delaySeconds: 0,
        bubble: {
          name: entry.name,
          message: entry.message,
          isToast: false,
          characterKey: null,
          iconKey: 'default',
          displaySeconds: props.settings.displaySeconds,
        },
        slots: { slot0: entry.slot0 },
      },
    ]
  })

  const hoge = () => {
    currentIndex.value++
  }
</script>
