<!-- src/MainGenerator/ui/FlightSeat/layouts/SeatGoldenCrowd.vue -->
<template>
  <div
    class="relative inline-flex flex-col items-center p-10 rounded-2xl overflow-hidden isolate border-2 border-amber-600/80 shadow-[0_0_30px_rgba(255,215,0,0.4),inset_0_1px_0_rgba(255,245,200,0.15)]"
  >
    <!-- 背景パーティクル -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none z-10" />

    <!-- 上下シャインライン -->
    <div class="absolute left-[5%] right-[5%] h-px z-20 top-8 overflow-hidden">
      <div class="w-full h-full bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
    </div>
    <div class="absolute left-[5%] right-[5%] h-px z-20 bottom-8 overflow-hidden">
      <div class="w-full h-full bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
    </div>

    <!-- コーナーエンブレム -->
    <template v-for="(pos, i) in ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3']" :key="i">
      <div
        :class="`absolute ${pos} text-amber-400 z-30 animate-pulse text-xl drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]`"
      >
        ✦
      </div>
    </template>

    <!-- メインカード -->
    <div class="relative z-40 rounded-xl overflow-hidden">
      <!-- シート本体 -->
      <div class="flex flex-col items-center gap-3 relative z-30 p-4">
        <div
          v-for="(count, row) in layout"
          :key="row"
          class="grid gap-3 mx-auto"
          :style="{ gridTemplateColumns: `repeat(${count}, 5rem)` }"
        >
          <SeatCell
            v-for="col in count"
            :key="seatAt(row, col)?.lastVisit ?? `${row}-${col}`"
            :seat="seatAt(row, col)"
            :index="rowOffset(row) + col - 1"
            :statKey="statKey"
            :colorFrom="(col - 1) % 2 === 0 ? (color.backFrom ?? 'warning') : (color.backTo ?? 'info')"
            :opacity="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRafFn, useElementSize } from '@vueuse/core'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import SeatCell from './SeatCell.vue'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    color: DaisyUiThemeFieldsType
    seats: (UserStatsRecord | null)[]
    statKey: StatKeyNum | null
    customLayout?: number[]
  }>()

  const layout = props.customLayout ?? ([22, 23, 24, 23, 24, 23, 22, 23, 24, 23, 24, 23, 22] as const)
  const rowOffset = (row: number) => layout.slice(0, row).reduce((sum, n) => sum + n, 0)
  const seatAt = (row: number, col: number): UserStatsRecord | null => props.seats[rowOffset(row) + col - 1] ?? null

  // パーティクル関連（変更なし）
  const stageRef = ref<HTMLElement | null>(null)
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const { width: stageW, height: stageH } = useElementSize(stageRef)

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    hue: number
    type: 'star' | 'sparkle' | 'diamond'
  }

  const particles: Particle[] = []
  let ctx: CanvasRenderingContext2D | null = null

  function spawnParticle() {
    const w = stageW.value || 800
    const h = stageH.value || 600
    const types: Particle['type'][] = ['star', 'sparkle', 'diamond']
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 1.2 - 0.3,
      life: 0,
      maxLife: 80 + Math.random() * 80,
      size: 2 + Math.random() * 5,
      hue: 38 + (Math.random() - 0.5) * 20,
      type: types[Math.floor(Math.random() * 3)],
    })
  }

  function drawStar(cx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, hue: number) {
    const spikes = 4
    const innerR = r * 0.4
    cx.save()
    cx.globalAlpha = alpha
    cx.translate(x, y)
    cx.rotate(Math.PI / 4)
    cx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes
      const rr = i % 2 === 0 ? r : innerR
      if (i === 0) cx.moveTo(Math.cos(angle) * rr, Math.sin(angle) * rr)
      else cx.lineTo(Math.cos(angle) * rr, Math.sin(angle) * rr)
    }
    cx.closePath()
    const grad = cx.createRadialGradient(0, 0, 0, 0, 0, r)
    grad.addColorStop(0, `hsl(${hue}, 100%, 95%)`)
    grad.addColorStop(0.5, `hsl(${hue}, 100%, 65%)`)
    grad.addColorStop(1, `hsl(${hue}, 80%, 40%)`)
    cx.fillStyle = grad
    cx.shadowBlur = 10
    cx.shadowColor = `hsl(${hue}, 100%, 70%)`
    cx.fill()
    cx.restore()
  }

  function drawDiamond(cx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, hue: number) {
    cx.save()
    cx.globalAlpha = alpha
    cx.translate(x, y)
    cx.beginPath()
    cx.moveTo(0, -r)
    cx.lineTo(r * 0.6, 0)
    cx.lineTo(0, r)
    cx.lineTo(-r * 0.6, 0)
    cx.closePath()
    const grad = cx.createLinearGradient(-r, -r, r, r)
    grad.addColorStop(0, `hsl(${hue}, 100%, 90%)`)
    grad.addColorStop(0.5, `hsl(${hue - 5}, 80%, 55%)`)
    grad.addColorStop(1, `hsl(${hue + 10}, 60%, 35%)`)
    cx.fillStyle = grad
    cx.shadowBlur = 8
    cx.shadowColor = `hsl(${hue}, 100%, 80%)`
    cx.fill()
    cx.restore()
  }

  function drawSparkle(cx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
    cx.save()
    cx.globalAlpha = alpha
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2
      cx.beginPath()
      cx.moveTo(x, y)
      cx.lineTo(x + Math.cos(angle) * r * 2, y + Math.sin(angle) * r * 2)
      cx.lineWidth = r * 0.4
      cx.strokeStyle = `hsl(48, 100%, 80%)`
      cx.shadowBlur = 6
      cx.shadowColor = `hsl(48, 100%, 70%)`
      cx.stroke()
    }
    cx.restore()
  }

  let frame = 0
  const { pause, resume } = useRafFn(
    () => {
      if (!ctx || !canvasRef.value) return
      const w = stageW.value || 800
      const h = stageH.value || 600
      canvasRef.value.width = w
      canvasRef.value.height = h
      ctx.clearRect(0, 0, w, h)

      frame++
      if (frame % 3 === 0) {
        spawnParticle()
        spawnParticle()
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++
        if (p.life > p.maxLife) {
          particles.splice(i, 1)
          continue
        }
        const progress = p.life / p.maxLife
        const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1
        if (p.type === 'star') drawStar(ctx!, p.x, p.y, p.size, alpha * 0.9, p.hue)
        else if (p.type === 'diamond') drawDiamond(ctx!, p.x, p.y, p.size, alpha * 0.85, p.hue)
        else drawSparkle(ctx!, p.x, p.y, p.size * 0.7, alpha * 0.7)
      }
    },
    { immediate: false }
  )

  onMounted(() => {
    if (canvasRef.value) {
      ctx = canvasRef.value.getContext('2d')
      resume()
    }
  })
  onUnmounted(() => {
    pause()
  })
</script>

<style scoped>
  @keyframes shineLine {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes cardShine {
    0% {
      transform: translateX(-120%) skewX(-15deg);
    }
    100% {
      transform: translateX(120%) skewX(-15deg);
    }
  }

  @keyframes gridShift {
    0% {
      background-position:
        0px 0px,
        0px 0px;
    }
    100% {
      background-position:
        21px 21px,
        21px 21px;
    }
  }

  @keyframes rotateBorder {
    to {
      --border-angle: 360deg;
    }
  }

  @property --border-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
</style>
