<!-- src/MainGenerator/ui/WinnerGroup/components/ValentineCoupling/ValentineUserCard.vue -->
<template>
  <div v-motion :initial="initialAnimation" :enter="enterAnimation" :class="containerClass">
    <div :class="cardClass">
      <!-- カードの光沢効果 -->
      <div
        :class="[
          'absolute inset-0 pointer-events-none',
          position === 'left'
            ? 'bg-gradient-to-br from-primary to-primary/40'
            : 'bg-gradient-to-br from-secondary to-secondary/40',
        ]"
      />

      <figure class="px-4 pt-4 relative">
        <div class="avatar relative z-10 flex justify-center">
          <div :class="avatarRingClass">
            <img
              :src="user.profileImage || getAvatarUrl(user.userName || 'Anonymous')"
              :alt="user.userName"
              class="object-cover w-full h-full"
            />
          </div>
        </div>
      </figure>
      <div class="card-body items-center text-center p-3">
        <h3 :class="titleClass">{{ user.userName }}</h3>
        <div class="flex gap-1 mt-1">
          <Heart v-for="i in 3" :key="i" :class="heartClass" :style="{ animationDelay: `${(i - 1) * 0.1}s` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserVisitRecord } from '@/types/MainGenerator/'
  import { Heart } from 'lucide-vue-next'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  const props = defineProps<{
    user: UserVisitRecord
    position: 'left' | 'right'
    colorScheme: 'primary' | 'secondary'
  }>()

  const containerClass = computed(() => (props.position === 'left' ? 'flex justify-end' : 'flex justify-start'))

  const cardClass = computed(() => {
    const baseClass = 'card-3d shadow-xl w-44 border-2 rounded-xl overflow-hidden relative'
    const colorClass = props.position === 'left' ? 'bg-primary border-primary' : 'bg-secondary border-secondary'
    const transformClass = props.position === 'left' ? 'style-transform-left' : 'style-transform-right'

    return `${baseClass} ${colorClass} ${transformClass}`
  })

  const avatarRingClass = computed(() => {
    const baseClass = 'w-20 rounded-full ring-2 ring-offset-base-100 ring-offset-2 shadow-lg'
    const ringColor = props.position === 'left' ? 'ring-primary' : 'ring-secondary'

    return `${baseClass} ${ringColor}`
  })

  const titleClass = computed(() => {
    const baseClass = 'card-title text-lg font-bold'
    const textColor = props.position === 'left' ? 'text-primary-content' : 'text-secondary-content'

    return `${baseClass} ${textColor}`
  })

  const heartClass = computed(() => {
    const baseClass = 'w-3 h-3 animate-bounce'
    const colorClass =
      props.position === 'left'
        ? 'text-primary-content fill-primary-content'
        : 'text-secondary-content fill-secondary-content'

    return `${baseClass} ${colorClass}`
  })

  const initialAnimation = computed(() => ({
    opacity: 0,
    x: props.position === 'left' ? -100 : 100,
    rotateY: props.position === 'left' ? -45 : 45,
  }))

  const enterAnimation = computed(() => ({
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 1000, delay: 400 },
  }))
</script>

<style scoped>
  .card-3d {
    transition: transform 0.3s ease;
    transform-style: preserve-3d;
  }

  .style-transform-left {
    transform: perspective(1000px) rotateY(25deg);
  }

  .style-transform-right {
    transform: perspective(1000px) rotateY(-25deg);
  }
</style>
