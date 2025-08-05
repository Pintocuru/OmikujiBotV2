/// <reference types="jest" />

// tests/execute.test.ts
import { ExecuteScript } from '@/GameScripts/StealEmAll/src/execute';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameParams } from '@/GameScripts/StealEmAll/src/params';

// モックコメントデータを作成するヘルパー関数
const createMockComment = (displayName: string = 'TestUser'): Comment =>
 ({
  data: {
   displayName
   // 他の必要なプロパティがあれば追加
  }
 }) as Comment;

// モックパラメータ
const mockParams: GameParams = {};

describe('ExecuteScript', () => {
 let executor: ExecuteScript;

 beforeEach(() => {
  executor = new ExecuteScript();
  executor.setup({ isParty: true });
 });

 test('playGameForTest returns a valid result', () => {
  const result = executor.playGameForTest();

  expect(result).toHaveProperty('stage');
  expect(result).toHaveProperty('name');
  expect(result).toHaveProperty('ways');
  expect(result).toHaveProperty('payout');

  expect(typeof result.stage).toBe('string');
  expect(typeof result.name).toBe('string');
  expect(Array.isArray(result.ways)).toBe(true);
  expect(typeof result.payout).toBe('number');
 });

 describe('run method placeholders analysis', () => {
  test('run returns valid placeholders structure', () => {
   const comment = createMockComment('TestPlayer');
   const result = executor.run(comment, mockParams);

   expect(result).toHaveProperty('placeholders');
   expect(result.placeholders).toHaveProperty('message');
   expect(result.placeholders).toHaveProperty('stage');
   expect(result.placeholders).toHaveProperty('payout');
   expect(result.placeholders).toHaveProperty('winsRank');

   expect(typeof result.placeholders.message).toBe('string');
   expect(typeof result.placeholders.stage).toBe('string');
   expect(typeof result.placeholders.payout).toBe('string');
  });

  test('collect 100 game results to analyze patterns', () => {
   const results: Array<{
    stage: string;
    payout: string;
    message: string;
    enemyPattern?: string;
   }> = [];

   // 100回実行して結果を収集
   for (let i = 0; i < 100; i++) {
    const comment = createMockComment(`Player${i + 1}`);
    const result = executor.run(comment, mockParams);

    results.push({
     stage: String(result.placeholders.stage),
     payout: String(result.placeholders.payout),
     message: result.placeholders.message
    });
   }

   // 結果の統計を出力
   console.log('\n=== Game Results Analysis (100 runs) ===');

   // ステージ別の分布
   const stageDistribution: Record<string, number> = {};
   results.forEach((r) => {
    stageDistribution[r.stage] = (stageDistribution[r.stage] || 0) + 1;
   });

   console.log('\nStage Distribution:');
   Object.entries(stageDistribution)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([stage, count]) => {
     console.log(`Stage ${stage}: ${count} times (${((count / 100) * 100).toFixed(1)}%)`);
    });

   // 配当別の分布
   const payouts = results.map((r) => parseInt(r.payout)).sort((a, b) => a - b);
   console.log('\nPayout Statistics:');
   console.log(`Min: ${Math.min(...payouts)}`);
   console.log(`Max: ${Math.max(...payouts)}`);
   console.log(`Average: ${(payouts.reduce((a, b) => a + b, 0) / payouts.length).toFixed(2)}`);
   console.log(`Median: ${payouts[Math.floor(payouts.length / 2)]}`);

   // 高配当の結果を表示
   const highPayouts = results
    .filter((r) => parseInt(r.payout) >= 1000)
    .sort((a, b) => parseInt(b.payout) - parseInt(a.payout));

   if (highPayouts.length > 0) {
    console.log('\nHigh Payout Results (>=1000):');
    highPayouts.slice(0, 10).forEach((result, index) => {
     console.log(`${index + 1}. Stage ${result.stage}, Payout: ${result.payout}`);
     console.log(`   Message: ${result.message}`);
    });
   }

   // MAX WIN の確認
   const maxWins = results.filter((r) => parseInt(r.payout) === 20000);
   console.log(`\nMAX WIN (20000) achieved: ${maxWins.length} times`);

   // 基本的な検証
   expect(results).toHaveLength(100);
   results.forEach((result, index) => {
    expect(parseInt(result.stage)).toBeGreaterThanOrEqual(0);
    expect(parseInt(result.payout)).toBeGreaterThan(0);
    expect(result.message).toContain(`Player${index + 1}`);
    expect(result.message).toContain('ダンジョン攻略');
    expect(result.message).toContain('獲得');
   });
  });

  test('analyze message patterns', () => {
   const messagePatterns: Record<string, number> = {};
   const users = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

   for (let i = 0; i < 50; i++) {
    const user = users[i % users.length];
    const comment = createMockComment(user);
    const result = executor.run(comment, mockParams);

    // メッセージから勝利タイプを抽出
    const message = result.placeholders.message;
    const winPatterns = [
     '🌟MAX WIN🌟',
     '👑JACKPOT👑',
     '💎EPIC WIN💎',
     '♕FEVER♕',
     '🎯大当り🎯',
     '✌あたり✌'
    ];

    let foundPattern = 'その他';
    for (const pattern of winPatterns) {
     if (message.includes(pattern)) {
      foundPattern = pattern;
      break;
     }
    }

    messagePatterns[foundPattern] = (messagePatterns[foundPattern] || 0) + 1;
   }

   console.log('\n=== Message Pattern Analysis (50 runs) ===');
   Object.entries(messagePatterns)
    .sort(([, a], [, b]) => b - a)
    .forEach(([pattern, count]) => {
     console.log(`${pattern}: ${count} times (${((count / 50) * 100).toFixed(1)}%)`);
    });

   // 基本検証
   const totalPatterns = Object.values(messagePatterns).reduce((a, b) => a + b, 0);
   expect(totalPatterns).toBe(50);
  });

  test('verify payout ranges for different stages', () => {
   const stagePayouts: Record<string, number[]> = {};

   for (let i = 0; i < 200; i++) {
    const comment = createMockComment(`TestUser${i}`);
    const result = executor.run(comment, mockParams);

    const stage = result.placeholders.stage;
    const payout = parseInt(String(result.placeholders.payout));

    if (!stagePayouts[stage]) {
     stagePayouts[stage] = [];
    }
    stagePayouts[stage].push(payout);
   }

   console.log('\n=== Payout Ranges by Stage (200 runs) ===');
   Object.entries(stagePayouts)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([stage, payouts]) => {
     const min = Math.min(...payouts);
     const max = Math.max(...payouts);
     const avg = (payouts.reduce((a, b) => a + b, 0) / payouts.length).toFixed(2);
     console.log(`Stage ${stage}: Min=${min}, Max=${max}, Avg=${avg}, Count=${payouts.length}`);
    });

   // 基本検証: 全ての配当が正の値であること
   Object.values(stagePayouts)
    .flat()
    .forEach((payout) => {
     expect(payout).toBeGreaterThan(0);
     expect(payout).toBeLessThanOrEqual(20000); // MAX_WIN以下
    });
  });

  test('test with unknown user', () => {
   // displayNameがundefinedの場合のテスト
   const comment = { data: {} } as Comment;
   const result = executor.run(comment, mockParams);

   expect(result.placeholders.message).toContain('Unknown');
   expect(result.placeholders.message).toContain('ダンジョン攻略');
  });

  test('consistent results structure across multiple runs', () => {
   for (let i = 0; i < 20; i++) {
    const comment = createMockComment(`User${i}`);
    const result = executor.run(comment, mockParams);

    // 構造の一貫性をチェック
    expect(result).toHaveProperty('postActions');
    expect(result).toHaveProperty('placeholders');
    expect(result).toHaveProperty('rankingList');

    expect(Array.isArray(result.postActions)).toBe(true);
    expect(typeof result.placeholders).toBe('object');

    // placeholdersの型チェック
    expect(typeof result.placeholders.message).toBe('string');
    expect(typeof result.placeholders.stage).toBe('string');
    expect(typeof result.placeholders.payout).toBe('string');

    // 値の範囲チェック
    const stage = parseInt(String(result.placeholders.stage));
    const payout = parseInt(String(result.placeholders.payout));

    expect(stage).toBeGreaterThanOrEqual(0);
    expect(stage).toBeLessThanOrEqual(8); // 最大ステージ数
    expect(payout).toBeGreaterThan(0);
    expect(payout).toBeLessThanOrEqual(20000);
   }
  });
 });
});
