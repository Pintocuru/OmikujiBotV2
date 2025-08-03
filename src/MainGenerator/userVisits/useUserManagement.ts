// src/MainGenerator/userVisits/useUserManagement.ts
import { ref } from 'vue';
import { UserVisitPlus } from './useCustomProperties';

export const useUserManagement = () => {
 // 手動追加されたユーザーを保持（新しいデータで上書きされない）
 // カスタムプロパティ付きのユーザーとして管理
 const additionalUsers = ref<Record<string, UserVisitPlus>>({});

 // Hidden users (individual user hiding)
 const hiddenUsers = ref<Set<string>>(new Set());

 // Manual order for sorting
 const manualOrder = ref<string[]>([]);

 const addUser = (user: UserVisitPlus) => {
  additionalUsers.value[user.userId] = user;
 };

 const removeAddedUser = (userId: string) => {
  delete additionalUsers.value[userId];
  hiddenUsers.value.delete(userId);

  // 手動ソートからも削除
  const index = manualOrder.value.indexOf(userId);
  if (index > -1) {
   manualOrder.value.splice(index, 1);
  }
 };

 const hideUser = (userId: string) => {
  hiddenUsers.value.add(userId);
 };

 const unhideUser = (userId: string) => {
  hiddenUsers.value.delete(userId);
 };

 const updateManualOrder = (users: UserVisitPlus[]) => {
  manualOrder.value = users.map((user) => user.userId);
 };

 // 追加ユーザーの更新（カスタムプロパティも含む）
 const updateAdditionalUser = (userId: string, updates: Partial<UserVisitPlus>) => {
  if (additionalUsers.value[userId]) {
   additionalUsers.value[userId] = {
    ...additionalUsers.value[userId],
    ...updates
   };
  }
 };

 return {
  additionalUsers,
  hiddenUsers,
  manualOrder,
  addUser,
  removeAddedUser,
  hideUser,
  unhideUser,
  updateManualOrder,
  updateAdditionalUser
 };
};
