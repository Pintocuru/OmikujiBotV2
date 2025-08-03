// tests/execute.test.ts
import { GameParamsSchema, GameSettingsSchema } from '@/params';
import { ExecuteScript } from '@/execute';
import { MockComment } from '@shared/__mocks__/CreateMockComment';

// コメント
const mockComment = MockComment('suika');
const instance = new ExecuteScript();

// パラメータ
const mockSettings = GameSettingsSchema.parse({});
const mockParams = GameParamsSchema.parse({});

describe('ExecuteScript', () => {
 it('should return result with placeholders after running', () => {
  // setup を呼び出す
  instance.setup(mockSettings);

  // run を実行
  const result = instance.run(mockComment, mockParams);

  // 結果を見る
  console.info(result.placeholders);

  // 結果を確認
  expect(result).toBeDefined();
 });
});
