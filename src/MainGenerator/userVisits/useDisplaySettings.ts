// src/MainGenerator/userVisits/useDisplaySettings.ts
import { ref } from 'vue';

export const useDisplaySettings = () => {
 const showDisplaySettings = ref(false);
 const showTeamDisplay = ref(false);

 // Display settings for optional fields
 const displaySettings = ref({
  userId: false,
  badges: false,
  timestamp: false,
  isSyoken: false,
  count: false,
  totalPrice: false,
  service: true
 });

 const toggleDisplay = (field: string) => {
  displaySettings.value[field as keyof typeof displaySettings.value] =
   !displaySettings.value[field as keyof typeof displaySettings.value];
 };

 return {
  showDisplaySettings,
  showTeamDisplay,
  displaySettings,
  toggleDisplay
 };
};
