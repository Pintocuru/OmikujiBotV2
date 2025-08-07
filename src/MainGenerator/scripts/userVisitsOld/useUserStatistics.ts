// src/MainGenerator/userVisits/useUserStatistics.ts
import { computed, Ref } from 'vue';
import { UserVisitType } from '@shared/types/';
import { UserVisitPlus, CustomProperties } from './useCustomProperties';

export const useUserStatistics = (
 filteredUsers: Ref<UserVisitPlus[]>,
 allUsers: Ref<UserVisitPlus[]>,
 hiddenUsers: Ref<Set<string>>,
 getCustomProperty: <T extends UserVisitType>(user: T, property: keyof CustomProperties) => any,
 showTeamDisplay: Ref<boolean>
) => {
 const totalUsers = computed(() => filteredUsers.value.length);
 const syokenUsers = computed(() => filteredUsers.value.filter((user) => user.isSyoken).length);

 const hiddenUsersList = computed(() => {
  const hiddenUserIds = Array.from(hiddenUsers.value);
  return allUsers.value.filter((user) => hiddenUserIds.includes(user.userId));
 });

 // カラーグループの統計（チーム表示用）
 const colorGroups = computed(() => {
  if (!showTeamDisplay.value) return [];

  const groups = new Map<string, UserVisitPlus[]>();

  filteredUsers.value.forEach((user) => {
   const color = getCustomProperty(user, 'color') || '#3B82F6';
   if (!groups.has(color)) {
    groups.set(color, []);
   }
   groups.get(color)?.push(user);
  });

  return Array.from(groups.entries())
   .sort((a, b) => (b[1]?.length || 0) - (a[1]?.length || 0))
   .map(([color, users]) => ({
    color,
    users,
    count: users.length,
    totalScore: users.reduce((sum, user) => {
     const score = getCustomProperty(user, 'score') || 0;
     return sum + score;
    }, 0),
    averageScore:
     users.length > 0
      ? users.reduce((sum, user) => {
         const score = getCustomProperty(user, 'score') || 0;
         return sum + score;
        }, 0) / users.length
      : 0,
    totalPrice: users.reduce((sum, user) => sum + user.totalPrice, 0),
    totalComments: users.reduce((sum, user) => sum + user.count, 0)
   }));
 });

 // スコア統計
 const scoreStatistics = computed(() => {
  const scores = filteredUsers.value.map((user) => getCustomProperty(user, 'score') || 0);

  if (scores.length === 0) {
   return {
    min: 0,
    max: 0,
    average: 0,
    total: 0
   };
  }

  return {
   min: Math.min(...scores),
   max: Math.max(...scores),
   average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
   total: scores.reduce((sum, score) => sum + score, 0)
  };
 });

 // ステータス統計
 const statusStatistics = computed(() => {
  const statusGroups = new Map<string, number>();

  filteredUsers.value.forEach((user) => {
   const status = getCustomProperty(user, 'status') || '未設定';
   statusGroups.set(status, (statusGroups.get(status) || 0) + 1);
  });

  return Array.from(statusGroups.entries())
   .sort((a, b) => b[1] - a[1])
   .map(([status, count]) => ({ status, count }));
 });

 // サービス統計
 const serviceStatistics = computed(() => {
  const serviceGroups = new Map<string, UserVisitPlus[]>();

  filteredUsers.value.forEach((user) => {
   const service = user.service;
   if (!serviceGroups.has(service)) {
    serviceGroups.set(service, []);
   }
   serviceGroups.get(service)?.push(user);
  });

  return Array.from(serviceGroups.entries())
   .sort((a, b) => (b[1]?.length || 0) - (a[1]?.length || 0))
   .map(([service, users]) => ({
    service,
    users,
    count: users.length,
    totalPrice: users.reduce((sum, user) => sum + user.totalPrice, 0),
    totalComments: users.reduce((sum, user) => sum + user.count, 0)
   }));
 });

 return {
  totalUsers,
  syokenUsers,
  hiddenUsersList,
  colorGroups,
  scoreStatistics,
  statusStatistics,
  serviceStatistics
 };
};
