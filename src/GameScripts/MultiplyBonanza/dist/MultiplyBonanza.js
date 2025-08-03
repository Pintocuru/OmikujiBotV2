function m(a, t) {
 return { ruleId: a, totalDraws: 0, userStats: {}, currentUserIds: [] };
}
class p {
 static DEFAULT_USER_NAME = 'Unknown';
 static WIN_RATE_MULTIPLIER = 100;
 settings = { rankMode: 'wins' };
 gameState = m('WinChan');
 setup(t) {
  (this.settings = t), (this.gameState = m('WinChan'));
 }
 run(t, n) {
  const e = this.gameState,
   s = t == null ? void 0 : t.data.userId;
  if (!s) throw new Error('User ID is required');
  try {
   const r = this.updateUserStats(e.userStats, t, n, s),
    i = this.generateRankings(e, r, n, s),
    o = this.calculatePlaceholders(r[s], i, s);
   return (this.gameState = { ...e, rankings: i, userStats: r }), { placeholders: o, postActions: [] };
  } catch (r) {
   throw (console.error('Game execution error:', r), new Error('ゲーム実行中にエラーが発生しました'));
  }
 }
 updateUserStats(t, n, e, s) {
  const r = { ...(t[s] ?? { userId: s, name: n.data.name, draws: 0 }) },
   { isWin: i, getPoint: o } = e,
   { rankMode: u } = this.settings;
  return (
   i && (r.wins = u === 'point' ? 1 : (r.wins || 0) + 1),
   o > 0 && (r.points = u === 'point' ? o : (r.points || 0) + o),
   u !== 'point' && (r.draws = (r.draws || 0) + 1),
   { ...t, [s]: r }
  );
 }
 generateRankings(t, n, e, s) {
  if (!e.isRank) return t.rankings || [];
  switch (this.settings.rankMode) {
   case 'point':
    return this.generatePointRankings(n, s);
   case 'wins':
   case 'rate':
   case 'totalPoints':
    return this.generateTotalRankings(t, n, s);
   default:
    return (
     console.warn(`Unknown rank mode: ${this.settings.rankMode}. Using total rankings.`),
     this.generateTotalRankings(t, n, s)
    );
  }
 }
 generatePointRankings(t, n) {
  const e = t[n];
  return e
   ? [{ userId: n, name: e.name || p.DEFAULT_USER_NAME, points: e.points || 0, rank: 1 }]
   : (console.warn(`User stats not found for userId: ${n}`), []);
 }
 generateTotalRankings(t, n, e) {
  const s = t.rankings || [],
   r = Object.entries(n).map(([u, c]) => {
    const h = s.find((f) => f.userId === u),
     g = c.draws ?? (h == null ? void 0 : h.draws) ?? 0,
     y = c.wins ?? (h == null ? void 0 : h.wins) ?? 0,
     R = c.points ?? (h == null ? void 0 : h.points) ?? 0;
    return {
     userId: u,
     name: c.name || p.DEFAULT_USER_NAME,
     draws: g,
     wins: y,
     points: R,
     rate: g > 0 ? (y / g) * p.WIN_RATE_MULTIPLIER : 0
    };
   }),
   i = this.getSortKey(),
   o = r
    .sort((u, c) => {
     const h = u[i] ?? 0;
     return (c[i] ?? 0) - h;
    })
    .map((u, c) => ({ ...u, rank: c + 1 }));
  return this.prioritizeCurrentUser(o, e);
 }
 getSortKey() {
  return { wins: 'wins', rate: 'rate', point: 'points', totalPoints: 'points' }[this.settings.rankMode] || 'wins';
 }
 prioritizeCurrentUser(t, n) {
  const e = t.findIndex((i) => i.userId === n);
  if (e === -1) return t;
  const s = [...t],
   [r] = s.splice(e, 1);
  return s.unshift(r), s;
 }
 calculatePlaceholders(t, n, e) {
  const s = String(t.wins ?? 0);
  let r;
  if (this.settings.rankMode === 'point') {
   const i = t.points ?? 0,
    o = n.filter((u) => (u.points ?? 0) > i).length;
   r = String(o + 1);
  } else {
   const i = n.findIndex((o) => o.userId === e);
   r = i >= 0 ? String(i + 1) : '不明';
  }
  return {
   winsCount: s,
   winsRank: r,
   winsRate: (t.draws > 0 ? ((t.wins ?? 0) / t.draws) * p.WIN_RATE_MULTIPLIER : 0).toFixed(1)
  };
 }
}
const k = new p(),
 l = [
  { weight: 27, payouts: [0.1, 0.1, 0.1], icon: '⛈️', name: '10', party: '!bonanza10' },
  { weight: 21, payouts: [0.2, 0.3, 0.4], icon: '🌙', name: 'J', party: '!bonanzaJ' },
  { weight: 17, payouts: [0.3, 0.8, 2], icon: '🎍', name: 'Q', party: '!bonanzaQ' },
  { weight: 15, payouts: [0.5, 1.5, 3.5], icon: '🌊', name: 'K', party: '!bonanzaK' },
  { weight: 12, payouts: [0.8, 2.5, 5], icon: '🌸', name: 'ACE', party: '!bonanzaACE' },
  { weight: 9, payouts: [1.5, 4, 10], icon: '🌟', name: 'SSR', party: '!bonanzaSSR' }
 ],
 w = l.reduce((a, t) => a + t.weight, 0),
 M = [
  [2e4, '🌟MAX WIN🌟 上限の'],
  [1e4, '👑JACKPOT👑'],
  [5e3, '💎EPIC WIN💎'],
  [2500, '♕FEVER♕'],
  [1e3, '🎯大当り🎯'],
  [500, '✌あたり✌']
 ],
 I = new (class {
  settings = { isParty: 'ON' };
  winChan = k;
  setup(a) {
   (this.settings = a), this.winChan.setup({ rankMode: 'point' });
  }
  run(a, t) {
   const n = (a == null ? void 0 : a.data.displayName) ?? 'Unknown',
    e = this.playGame(),
    s = this.createMessage(n, e),
    r = this.winChan.run(a, { isWin: 'OFF', getPoint: e.payout, isRank: t.isRank });
   return {
    postActions: (this.settings.isParty, []),
    placeholders: { message: s, symbol: e.symbol, payout: String(e.payout), winsRank: r.placeholders.winsRank }
   };
  }
  playGame() {
   for (let a = 1; a <= 3; a++) {
    const t = this.calculateBoost(),
     n = this.generateReels(a, t),
     e = this.calculateResult(n, a);
    if (e.payout > 0) return { ...e, hasBoost: t > 0 };
   }
   return this.createEmptyResult();
  }
  calculateBoost() {
   return Math.random() < 0.15 ? Math.floor((Math.random() * w * 2) / 3) : 0;
  }
  generateReels(a, t) {
   return Array.from({ length: 5 }, () => {
    const n = new Array(l.length).fill(0),
     e = 7 + a * a,
     s = Math.floor(Math.random() * e) + 1,
     r = Math.max(Math.floor(Math.random() * a * 2.5), 1);
    for (let i = 0; i < s; i++) n[this.selectSymbolByWeight(t)] += r;
    return n;
   });
  }
  selectSymbolByWeight(a) {
   let t = Math.floor(Math.random() * (w - a)) + a;
   for (let n = 0; n < l.length; n++) if (((t -= l[n].weight), t < 0)) return n;
   return l.length - 1;
  }
  calculateResult(a, t) {
   let n = this.createEmptyResult();
   for (let e = 0; e < l.length; e++) {
    const s = this.calculateWays(a, e);
    if (s.length < 3) continue;
    const r = this.calculatePayout(e, s);
    r > n.payout &&
     (n = {
      symbolIdx: e,
      symbol: this.generateSymbolDisplay(e, t),
      name: l[e].name,
      ways: s,
      payout: r,
      hasBoost: !1
     });
   }
   return n;
  }
  calculateWays(a, t) {
   const n = [];
   if (!a[0][t] || !a[1][t] || !a[2][t]) return n;
   for (let e = 0; e < a.length && a[e][t]; e++) n.push(a[e][t]);
   return n;
  }
  calculatePayout(a, t) {
   const n = l[a],
    e = Math.min(t.length - 3, n.payouts.length - 1),
    s = n.payouts[e],
    r = t.reduce((i, o) => i * o, 1);
   return Math.min(Math.floor(s * r), 2e4);
  }
  generateSymbolDisplay(a, t) {
   return l[a].icon.repeat(t);
  }
  createEmptyResult() {
   return { symbolIdx: 0, symbol: '', name: '', ways: [], payout: 0, hasBoost: !1 };
  }
  createMessage(a, t) {
   if (t.payout === 0) return `${a}のかけざんスピン!残念、配当0でした。`;
   const n = l[t.symbolIdx],
    e = t.ways.join('×'),
    s = n.payouts[Math.min(t.ways.length - 3, n.payouts.length - 1)],
    r = t.ways.reduce((o, u) => o * u, 1),
    i = this.getWinMessage(t.payout);
   return `${a}の${t.hasBoost ? '⚡️' : ''}${t.symbol}${t.name}スピン!${s}配当、${e}=${r}通り。${i}${t.payout}枚獲得!`;
  }
  getWinMessage(a) {
   const t = M.find(([n]) => a >= n);
   return t ? t[1] : '';
  }
 })(),
 d = {
  name: 'multiply-bonanza',
  version: '0.0.1',
  description: 'Bonanza Megaways/Wing FURAIJIN風のおみくじ',
  author: 'Pintocuru',
  keywords: ['ポイント', 'ランキング', 'スロット']
 },
 S = {
  id: d.name,
  name: d.name,
  description: d.description,
  version: d.version,
  author: d.author,
  tags: d.keywords,
  url: '',
  execute: I,
  settings: [
   {
    id: 'isParty',
    name: 'WordPartyで音を鳴らすか',
    description: 'ON:鳴らす(別途専用WordPartyが必要) / OFF:鳴らさない',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  params: [
   {
    id: 'isRank',
    name: '結果をランキングに入れるか',
    description: 'OFFなら、ランキングに影響を与えません',
    inputType: 'select',
    values: ['ON', 'OFF'],
    defaultValue: 'ON'
   }
  ],
  placeholders: [
   {
    id: 'message',
    name: '標準メッセージ',
    description: 'デフォルトの返答',
    value: 'userのかけざんスピン!残念、配当0でした。'
   },
   { id: 'symbol', name: 'シンボル', description: '当選した図柄を返します', value: 'セブン' },
   { id: 'payout', name: '獲得したポイント', description: '獲得したポイントを返します', value: '8004' },
   { id: 'winsRank', name: '順位', description: '今回の順位を返します', value: '1' }
  ]
 };
export { S as default };
