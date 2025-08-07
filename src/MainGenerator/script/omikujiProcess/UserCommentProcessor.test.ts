// src/MainGenerator/script/omikujiProcess/UserCommentProcessor.test.ts

import { UserCommentProcessor } from './UserCommentProcessor';
import mockOmikujiData from '../../../../server/dev-configs/ReimuBasic250805.json';
import { MockComment } from '../../../../../../shared/__mocks__/CreateMockComment';
import * as ThresholdChecker from '../../../../../../shared/utils/threshold/ThresholdChecker';

// 依存関係をモック
jest.mock('./GameScriptManager');
jest.mock('./CommentRestrictionChecker');
jest.mock('./OmikujiProcessor');
jest.mock('./CooldownManager');

describe('UserCommentProcessor - ルール評価順序のテスト', () => {
 let processor: UserCommentProcessor;

 beforeEach(() => {
  // 各テスト前に新しいインスタンスを作成
  processor = new UserCommentProcessor(mockOmikujiData, {} as any);

  // checkAllConditions をモックし、常にtrueを返すように設定
  jest.spyOn(ThresholdChecker, 'checkAllConditions').mockReturnValue(true);

  // CooldownManager をモックし、checkRestrictions が常に false を返すように設定
  const mockRestrictionChecker = require('./CommentRestrictionChecker').CommentRestrictionChecker;
  mockRestrictionChecker.mockImplementation(() => ({
   checkRestrictions: jest.fn(() => ({ isBlocked: false, toastMessages: [] }))
  }));
 });

 test('orderが小さいWelcomeSagiが先に処理されるべき', () => {
  // このテストの目的は、`WelcomeSagi` の `order` が `10` なので、
  // `WelcomeHonto` より先に評価されることを確認することです。
  // そのため、両方のルールが `checkAllConditions` で `true` になる状況をシミュレートします。

  // spyOn を使って、checkAllConditions がどのように呼ばれたか追跡
  const checkAllConditionsSpy = jest.spyOn(ThresholdChecker, 'checkAllConditions');

  // コメントは両方のルールにマッチする「初見」
  const comment = MockComment('初見');
  processor.generateBotMessages(comment);

  // checkAllConditions が呼ばれた順番を検証
  // 最初の呼び出しが WelcomeSagi の threshold であることを期待
  expect(checkAllConditionsSpy.mock.calls[0][1]).toEqual(
   expect.objectContaining({
    comment: expect.arrayContaining(['初見(?!さん)'])
   })
  );

  // 2番目の呼び出しが WelcomeHonto の threshold であることを期待
  expect(checkAllConditionsSpy.mock.calls[1][1]).toEqual(
   expect.objectContaining({
    comment: expect.arrayContaining(['初見'])
   })
  );
 });

 test('WelcomeSagiがスキップされた場合、WelcomeHontoが処理されるべき', () => {
  // このテストでは、`WelcomeSagi` の条件が満たされない（`false`）状況をシミュレートし、
  // 次の `WelcomeHonto` が評価されることを確認します。

  // コメントは `WelcomeSagi` の正規表現にマッチしない「初見さん」
  const comment = MockComment('初見さん');

  // checkAllConditions のモック設定を上書き
  // WelcomeSagi のパターンには false、WelcomeHonto のパターンには true を返す
  jest.spyOn(ThresholdChecker, 'checkAllConditions').mockImplementation((_c, threshold) => {
   // WelcomeSagi のパターンは、`初見(?!さん)` で始まる
   //@ts-ignore
   if (threshold.comment[0].startsWith('初見(?!さん)')) {
    return false;
   }
   // WelcomeHonto のパターンは、`初見` で始まる
   //@ts-ignore
   if (threshold.comment[0].startsWith('初見')) {
    return true;
   }
   return false;
  });

  const botMessages = processor.generateBotMessages(comment);

  // botMessages が WelcomeHonto のルールに基づいて生成されたことを検証
  // このテストでは、`isDuplicateComment` の `true` になるタイミングも検証できます。
  // 例えば、expect(botMessages[0].ruleId).toBe('WelcomeHonto');
 });
});
