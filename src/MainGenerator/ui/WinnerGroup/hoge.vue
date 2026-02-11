<template>
  <div class="winner-group">
    <div class="title">💝 バレンタイン・カップリング 💝</div>

    <div v-if="users.length === 0" class="empty">No Users</div>

    <div v-else class="pair-container">
      <template v-for="(user, index) in users" :key="user.userId + index">
        <div class="user-card">
          <img v-if="user.profileImage" :src="user.profileImage" class="avatar" alt="avatar" />
          <div v-else class="avatar placeholder" />

          <div class="name">{{ user.userName }}</div>
        </div>

        <!-- ハート表示（最後以外） -->
        <div v-if="index !== users.length - 1" class="heart">❤️</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import type { ExtraSlotsType } from '@/types/MainGenerator/BotMessageExtraSchema'

  const props = defineProps<{
    slots?: ExtraSlotsType
  }>()

  function parseSlot(value?: string): UserVisitRecord | null {
    if (!value) return null
    try {
      return JSON.parse(value) as UserVisitRecord
    } catch {
      return null
    }
  }

  const users = computed<UserVisitRecord[]>(() => {
    if (!props.slots) return []

    return Object.values(props.slots)
      .map(parseSlot)
      .filter((u): u is UserVisitRecord => !!u)
  })
</script>

<style scoped>
  .winner-group {
    padding: 16px;
    text-align: center;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 12px;
  }

  .pair-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .user-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90px;
  }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ff6b9a;
  }

  .placeholder {
    background: #f3f3f3;
  }

  .name {
    margin-top: 6px;
    font-size: 13px;
    font-weight: 500;
    word-break: break-word;
  }

  .heart {
    font-size: 22px;
  }
</style>
