<!-- src/common/AirComment/AirComment.vue -->
<template>
  <div class="card bg-base-200 border border-base-300 shadow-2xl">
    <div class="card-body gap-2 p-2">
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-base-300 cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <h1 class="text-sm flex items-center gap-2">エアコメメーカー</h1>

        <div class="flex items-center gap-1">
          <span class="text-xs opacity-60">
            {{ collapsed ? '▶' : '▼' }}
          </span>
        </div>
      </div>

      <!-- Accordion Body -->
      <template v-if="!collapsed">
        <div class="join">
          <!-- Interval -->
          <label class="label pr-2">
            <span class="label-text text-xs opacity-60"> INTERVAL (SEC) </span>
          </label>

          <input
            type="number"
            step="0.1"
            min="0.1"
            v-model.number="intervalSec"
            class="input input-bordered input-xs"
          />
        </div>

        <button
          class="btn btn-xs btn-accent join-item flex-1"
          @click="USERNAME_MODE = USERNAME_MODE === 'simple' ? 'mock' : 'simple'"
        >
          MODE: {{ USERNAME_MODE }}
        </button>

        <!-- Buttons -->
        <div class="join w-full">
          <button @click="sendComment" class="btn btn-xs btn-outline join-item flex-1">送信</button>

          <button
            @click="toggleRunning"
            class="btn btn-xs join-item flex-1"
            :class="isRunning ? 'btn-error' : 'btn-primary'"
          >
            {{ isRunning ? 'STOP' : 'AUTO' }}
          </button>

          <button @click="burstSend" class="btn btn-xs btn-warning join-item flex-1">TEST100</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { COMMENTS, generateMockUsername, generateSimpleUsername } from './constants'
  import { postComment } from '@shared/sdk/post/PostOneComme'
  import { CommentPickSchema } from '@shared/types'
  import { getAvatarUrl } from '../DiceBear/getAvatarUrl'

  const isRunning = ref(false)
  const intervalSec = ref(2)
  const count = ref(0)
  const lastComment = ref('(テストコメントが入ります)')
  const collapsed = ref(false)

  // 切替フラグ（ref 化）
  const USERNAME_MODE = ref<'simple' | 'mock'>('simple')
  function generateUsername(): string {
    return USERNAME_MODE.value === 'mock' ? generateMockUsername() : generateSimpleUsername()
  }

  let timer: ReturnType<typeof setTimeout> | null = null

  function toggleRunning() {
    isRunning.value = !isRunning.value
    if (isRunning.value) loop()
    else clearTimer()
  }

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = null
  }

  function loop() {
    if (!isRunning.value) return

    timer = setTimeout(
      async () => {
        await sendComment()
        loop()
      },
      Math.max(100, intervalSec.value * 1000)
    )
  }

  async function sendComment() {
    const username = generateUsername()
    const comment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)]

    try {
      await postComment(
        {
          service: { id: '26c434d4-db3b-4975-9061-093cf7cdb5b2' },
          comment: CommentPickSchema.parse({
            userId: username,
            name: username,
            comment,
            profileImage: getAvatarUrl(username),
          }),
        },
        -5
      )

      count.value++
      lastComment.value = `${username}: ${comment}`
    } catch (e) {
      console.error(e)
    }
  }

  async function burstSend() {
    for (let i = 0; i < 100; i++) setTimeout(sendComment, i * 5)
  }

  onUnmounted(clearTimer)
</script>
