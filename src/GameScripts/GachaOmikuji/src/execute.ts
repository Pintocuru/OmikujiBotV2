// src/execute.ts
import { GameSettings, GameParams, GamePlaceholder, omikujiItems } from './params';
import { ScriptResult, ScriptClass, GameState } from '@/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

interface OmikujiDraw {
 prefix: string;
 content: string;
 rarity: number;
 index: number;
 rarityName: string;
}

/**

いまのおみくじBOTなら、これ作れるのでは？

export class ExecuteScript
 implements ScriptClass<GameSettings, GameParams, GamePlaceholder, GameState>
{
 private settings: GameSettings = { isSound: 'ON' };

 setup(settings: GameSettings): void {
  this.settings = settings;
 }

 run(comment: Comment, params: GameParams): ScriptResult<GamePlaceholder> {
  const draws = this.drawThreeOmikuji();
  const userName = comment?.data.displayName ?? 'Unknown';
  const message = this.formatMessage(userName, draws);
  const effects = this.createEffects(Math.max(...draws.map((d) => d.rarity)));

  return {
   postActions: this.settings.isSound === 'ON' ? effects : [],
   placeholders: {
    message,
    rarity: draws[2].rarityName
   }
  };
 }

 private drawThreeOmikuji(): OmikujiDraw[] {
  const totalWeight = omikujiItems.reduce((sum, item) => sum + item.weight, 0);
  const draws: OmikujiDraw[] = [];

  for (let i = 0; i < 3; i++) {
   let random = Math.random() * totalWeight;
   const itemIndex = omikujiItems.findIndex((item) => (random -= item.weight) <= 0);
   const item = omikujiItems[itemIndex];

   draws.push({
    prefix: item.prefix,
    content: item.content[Math.floor(Math.random() * item.content.length)],
    rarity: item.rarity,
    index: itemIndex,
    rarityName: item.rarityName
   });
  }

  return draws.sort((a, b) => a.index - b.index);
 }

 private formatMessage(userName: string, draws: OmikujiDraw[]): string {
  const results = draws.map((draw) => `${draw.prefix}${draw.content}吉!`).join(' ');
  return `${userName}の3連おみくじ! ${results}`;
 }

 private createEffects(maxRarity: number): PostActionWordParty[] {
  const rarityEffects: Record<number, PostActionWordParty[]> = {
   0: [{ delaySeconds: 0.7, wordParty: '!gacha_A1' }],
   1: [{ delaySeconds: 0.7, wordParty: '!gacha_A1' }],
   2: [
    { delaySeconds: 0.7, wordParty: '!gacha_B1' },
    { delaySeconds: 2.2, wordParty: '!gacha_B2' }
   ],
   3: [
    { delaySeconds: 0.7, wordParty: '!gacha_C1' },
    { delaySeconds: 2.2, wordParty: '!gacha_C2' },
    { delaySeconds: 2.2, wordParty: '!gacha_C3' }
   ],
   4: [
    { delaySeconds: 0.7, wordParty: '!gacha_A1' },
    { delaySeconds: 2.2, wordParty: '!gacha_C2' },
    { delaySeconds: 2.2, wordParty: '!gacha_C3' }
   ]
  };

  const baseEffects = [
   { delaySeconds: -1, wordParty: '!gacha_00A' },
   { delaySeconds: 0.8, wordParty: '!gacha_00B' }
  ];

  return [...(rarityEffects[maxRarity] || []), ...baseEffects];
 }
}

const execute = new ExecuteScript();
export default execute;
 */
