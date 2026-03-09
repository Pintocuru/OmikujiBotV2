<template>
  <div class="fixed bottom-4 right-4 z-50 w-64">
    <div class="card bg-base-200 border border-base-300 shadow-2xl">
      <div class="card-body gap-2 p-4">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-base-300">
          <h1 class="text-sm flex items-center gap-2">
            <span class="w-2 h-2 bg-primary rounded-full" :class="{ 'animate-pulse': isRunning }" />
            エアコメメーカー
          </h1>

          <span class="badge badge-primary badge-xs">
            {{ count }}
          </span>
        </div>

        <!-- Interval -->
        <div class="form-control">
          <label class="label">
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

        <!-- Buttons -->
        <div class="join w-full">
          <button @click="sendComment" class="btn btn-xs btn-outline join-item flex-1">1回送信</button>

          <button
            @click="toggleRunning"
            class="btn btn-xs join-item flex-1"
            :class="isRunning ? 'btn-error' : 'btn-primary'"
          >
            {{ isRunning ? 'STOP' : 'AUTO START' }}
          </button>
        </div>

        <!-- Log -->
        <div v-if="lastComment" class="text-xs opacity-60 bg-base-100 p-2 rounded border border-base-300 truncate">
          "{{ lastComment }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { COMMENTS, generateUsername, getAvatarUrl } from './constants'
  import { postComment } from '@shared/sdk/postMessage/PostOneComme'
  import { CommentPickSchema } from '@shared/types'

  const isRunning = ref(false)
  const intervalSec = ref(2)
  const count = ref(0)
  const lastComment = ref('')

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
      await postComment({
        service: { id: 'OmikenReimu' },
        comment: CommentPickSchema.parse({
          userId: username,
          name: username,
          comment,
          profileImage: getAvatarUrl(username),
        }),
      })

      count.value++
      lastComment.value = `${username}: ${comment}`
    } catch (e) {
      console.error(e)
    }
  }

  onUnmounted(clearTimer)
</script>
