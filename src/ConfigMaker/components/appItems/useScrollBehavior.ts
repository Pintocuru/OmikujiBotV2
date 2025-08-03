// src/configMaker/composables/useScrollBehavior.ts
import { ref, onMounted, onUnmounted } from 'vue';

export const useScrollBehavior = () => {
 const showScrollTopButton = ref(false);
 const showDock = ref(false);

 const handleScroll = () => {
  const scrollY = window.scrollY;
  showScrollTopButton.value = scrollY > 300;
  showDock.value = scrollY > 300;
 };

 const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 onMounted(() => {
  window.addEventListener('scroll', handleScroll);
 });

 onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
 });

 return {
  showScrollTopButton,
  showDock,
  scrollToTop
 };
};
