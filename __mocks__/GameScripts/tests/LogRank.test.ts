// tests/execute.test.ts
import { RankingService } from '@/GameScripts/LogRank/src/services/RankingService';
import { UserStatsService } from '@/GameScripts/LogRank/src/services/UserStatsService';
import { GameContext } from '@/GameScripts/LogRank/src/GameContext';
import { GameSettings, GameParams } from '@/GameScripts/LogRank/src/params';
import { GameState, GameStateSchema, UserStatsType } from '@/types/';

describe('RankingService', () => {
 // テスト用のユーザーデータを生成
 const generateTestUsers = () => {
  return Array.from({ length: 10 }, (_, i) => ({
   id: `user${i + 1}`,
   name: `テストユーザー${i + 1}`
  }));
 };

 // ランダムなゲーム結果を生成（テスト用）
 const generateGameResult = (): GameParams => {
  return {
   isWin: Math.random() > 0.5, // 50%の確率で勝利
   getPoint: Math.floor(Math.random() * 100) + 1 // 1-100のランダムポイント
  };
 };

 // ゲームを実行してユーザー統計を更新
 const simulateGame = (context: GameContext, params: GameParams): Record<string, UserStatsType> => {
  return UserStatsService.updateUserStats({
   ...context,
   params
  });
 };

 // テスト結果をコンソールに出力
 const logRankingResults = (rankings: UserStatsType[], rankMode: string, gameNumber: number) => {
  console.log(
   `\n=== ${rankMode.toUpperCase()}モード - ゲーム${gameNumber}回目終了後のランキング ===`
  );
  console.log('順位 | ユーザー名 | 試行回数 | 勝利数 | 勝率(%) | 今回P | 総P');
  console.log('-----|-----------|----------|--------|---------|-------|------');

  rankings.slice(0, 10).forEach((user, index) => {
   const rank = user.rank || index + 1;
   const rate = user.rate ? user.rate.toFixed(1) : '0.0';
   const points = user.points || 0;
   const totalPoints = user.totalPoints || 0;
   const wins = user.wins || 0;
   const draws = user.draws || 0;

   console.log(
    `${rank.toString().padStart(4)} | ${user.name.padEnd(9)} | ${draws.toString().padStart(8)} | ${wins.toString().padStart(6)} | ${rate.padStart(7)} | ${points.toString().padStart(5)} | ${totalPoints.toString().padStart(4)}`
   );
  });
 };

 // 各rankModeのテスト
 describe.each([
  { rankMode: 'wins' as const, description: '勝利数' },
  { rankMode: 'rate' as const, description: '勝率' },
  { rankMode: 'point' as const, description: 'ポイント' }
 ])('$description モードのテスト', ({ rankMode }) => {
  test(`${rankMode}モードで10人が5回ゲームを行うランキングテスト`, () => {
   // テスト設定
   const settings: GameSettings = {
    rankMode,
    enableCount: 0 // 回数制限なし
   };

   // 初期ゲーム状態
   let gameState: GameState = GameStateSchema.parse({ ruleId: 'TestRank' });
   const testUsers = generateTestUsers();

   console.log(`\n🎮 ${rankMode.toUpperCase()}モードでのランキングテスト開始`);
   console.log(`👥 参加者: ${testUsers.length}人`);
   console.log(`🎯 ゲーム回数: 5回`);

   // 5回のゲームを実行
   for (let gameRound = 1; gameRound <= 5; gameRound++) {
    console.log(`\n--- ゲーム${gameRound}回目 ---`);

    // 各ユーザーがゲームを実行
    testUsers.forEach((user) => {
     const gameParams = generateGameResult();

     const context: GameContext = {
      settings,
      gameState,
      currentUser: user,
      params: gameParams
     };

     // ユーザー統計を更新
     const updatedUserStats = simulateGame(context, gameParams);
     gameState = { ...gameState, userStats: updatedUserStats };
    });

    // ランキングを生成
    const context: GameContext = {
     settings,
     gameState,
     currentUser: testUsers[0], // ダミー
     params: { isWin: false, getPoint: 0 } // ダミー
    };

    const rankings = RankingService.generateRankings(context);
    gameState = { ...gameState, userRankings: rankings };

    // 結果をコンソールに出力
    logRankingResults(rankings, rankMode, gameRound);

    // ランキングの検証
    expect(rankings).toHaveLength(testUsers.length);
    expect(rankings.every((user) => user.rank !== undefined)).toBe(true);

    // rankModeに応じたソート順の検証
    // 最後のユーザーをTOPにするため、下記はほぼ必ずFALL
    if (rankMode === 'wins') {
     // 勝利数でソートされているかチェック
     for (let i = 1; i < rankings.length; i++) {
      expect(rankings[i - 1].wins || 0).toBeGreaterThanOrEqual(rankings[i].wins || 0);
     }
    } else if (rankMode === 'rate') {
     // 勝率でソートされているかチェック
     for (let i = 1; i < rankings.length; i++) {
      expect(rankings[i - 1].rate || 0).toBeGreaterThanOrEqual(rankings[i].rate || 0);
     }
    } else if (rankMode === 'point') {
     // ポイントモードでは記録が複数作られることを確認
     expect(gameState.userRecords).toBeDefined();
     if (gameState.userRecords) {
      testUsers.forEach((user) => {
       expect(gameState.userRecords![user.id]).toHaveLength(gameRound);
      });
     }
    }
   }

   // 最終結果の統計情報
   console.log(`\n📊 ${rankMode.toUpperCase()}モード最終統計:`);
   const finalRankings = gameState.userRankings || [];
   const totalGames = finalRankings.reduce((sum, user) => sum + (user.draws || 0), 0);
   const totalWins = finalRankings.reduce((sum, user) => sum + (user.wins || 0), 0);
   const totalPoints = finalRankings.reduce((sum, user) => sum + (user.totalPoints || 0), 0);

   console.log(`総ゲーム数: ${totalGames}`);
   console.log(`総勝利数: ${totalWins}`);
   console.log(`総獲得ポイント: ${totalPoints}`);
   console.log(`平均勝率: ${totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0}%`);

   // 最終検証
   expect(totalGames).toBe(testUsers.length * 5); // 10人 × 5回 = 50ゲーム
   expect(finalRankings[0].rank).toBe(1); // 1位が存在する

   console.log(`✅ ${rankMode.toUpperCase()}モードのテスト完了\n`);
  });
 });

 // 特定シナリオのテスト
 test('決定的なデータでのランキング検証', () => {
  const settings: GameSettings = {
   rankMode: 'wins',
   enableCount: 0
  };

  let gameState: GameState = GameStateSchema.parse({ ruleId: 'DeterministicTest' });

  // 決定的なテストデータ
  const testScenarios = [
   {
    user: { id: 'user1', name: 'トップユーザー' },
    games: [
     { isWin: true, getPoint: 10 },
     { isWin: true, getPoint: 20 },
     { isWin: true, getPoint: 30 }
    ]
   },
   {
    user: { id: 'user2', name: '中位ユーザー' },
    games: [
     { isWin: true, getPoint: 15 },
     { isWin: false, getPoint: 5 },
     { isWin: true, getPoint: 25 }
    ]
   },
   {
    user: { id: 'user3', name: '下位ユーザー' },
    games: [
     { isWin: false, getPoint: 8 },
     { isWin: false, getPoint: 12 },
     { isWin: true, getPoint: 18 }
    ]
   }
  ];

  console.log('\n🎯 決定的データでのランキング検証');

  // シナリオを実行
  testScenarios.forEach((scenario) => {
   scenario.games.forEach((gameParams) => {
    const context: GameContext = {
     settings,
     gameState,
     currentUser: scenario.user,
     params: gameParams
    };

    const updatedUserStats = simulateGame(context, gameParams);
    gameState = { ...gameState, userStats: updatedUserStats };
   });
  });

  // 最終ランキング生成
  const context: GameContext = {
   settings,
   gameState,
   currentUser: testScenarios[0].user,
   params: { isWin: false, getPoint: 0 }
  };

  const rankings = RankingService.generateRankings(context);

  // 期待される順位を検証
  console.log('\n決定的データでの最終ランキング:');
  logRankingResults(rankings, 'wins', 3);

  // user1が1位（3勝）、user2が2位（2勝）、user3が3位（1勝）であることを確認
  expect(rankings.find((u) => u.userId === 'user1')?.rank).toBe(1);
  expect(rankings.find((u) => u.userId === 'user2')?.rank).toBe(2);
  expect(rankings.find((u) => u.userId === 'user3')?.rank).toBe(3);

  expect(rankings.find((u) => u.userId === 'user1')?.wins).toBe(3);
  expect(rankings.find((u) => u.userId === 'user2')?.wins).toBe(2);
  expect(rankings.find((u) => u.userId === 'user3')?.wins).toBe(1);

  console.log('✅ 決定的データでの検証完了');
 });
});
