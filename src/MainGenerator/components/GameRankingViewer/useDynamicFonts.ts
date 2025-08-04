// src/MainGenerator/components/GameRankingViewer/useDynamicFonts.ts
import { ref, computed, onMounted } from 'vue';

interface GoogleFont {
 family: string;
 variants?: string[];
 display?: string;
}

// TODO:何重にもバッファをかますのではなく、[RocknRoll One]等を直接指定できるようにしたい。
// TODO:指定されていない場合、読み込みができなかった場合は、フォントを指定しないようにしたい
export const fontMap: Record<string, string> = {
 'font-rocknroll': 'RocknRoll One',
 'font-mochiy': 'Mochiy Pop P One',
 'font-noto-sans-jp': 'Noto Sans JP',
 'font-kosugi-maru': 'Kosugi Maru',
 'font-m-plus-1p': 'M PLUS 1p',
 'font-sawarabi-gothic': 'Sawarabi Gothic',
 'font-kaisei-decol': 'Kaisei Decol',
 'font-zen-kaku-gothic-new': 'Zen Kaku Gothic New'
};

export function useDynamicFonts() {
 const loadedFonts = ref<Set<string>>(new Set());
 const isLoading = ref(false);

 // よく使われるフォントの定義
 const commonFonts: Record<string, GoogleFont> = {
  'RocknRoll One': { family: 'RocknRoll One', variants: ['400'] },
  'Mochiy Pop P One': { family: 'Mochiy Pop P One', variants: ['400'] },
  'Noto Sans JP': { family: 'Noto Sans JP', variants: ['400', '700'] },
  'Kosugi Maru': { family: 'Kosugi Maru', variants: ['400'] },
  'M PLUS 1p': { family: 'M PLUS 1p', variants: ['400', '700'] },
  'Sawarabi Gothic': { family: 'Sawarabi Gothic', variants: ['400'] },
  'Kaisei Decol': { family: 'Kaisei Decol', variants: ['400', '700'] },
  'Zen Kaku Gothic New': { family: 'Zen Kaku Gothic New', variants: ['400', '700'] }
 };

 // フォント名からクラス名を生成
 // TODO:直接URLに入れられる形にしたい。commonFonts というものに縛られたくない。
 const getFontClassName = (fontFamily: string): string => {
  return `font-${fontFamily
   .toLowerCase()
   .replace(/\s+/g, '-')
   .replace(/[^a-z0-9-]/g, '')}`;
 };

 // Google Fonts URLを生成
 const generateFontUrl = (fonts: GoogleFont[]): string => {
  const fontQueries = fonts.map((font) => {
   const variants = font.variants?.join(',') || '400';
   return `family=${encodeURIComponent(font.family)}:wght@${variants}`;
  });

  return `https://fonts.googleapis.com/css2?${fontQueries.join('&')}&display=swap`;
 };

 // 単一フォントを読み込み
 const loadFont = async (fontFamily: string): Promise<boolean> => {
  if (loadedFonts.value.has(fontFamily)) {
   return true;
  }

  const font = commonFonts[fontFamily];
  if (!font) {
   console.warn(`Font "${fontFamily}" is not defined in commonFonts`);
   return false;
  }

  return loadFonts([font]);
 };

 // 複数フォントを読み込み
 const loadFonts = async (fonts: GoogleFont[]): Promise<boolean> => {
  if (isLoading.value) return false;

  isLoading.value = true;

  try {
   // 既に読み込まれていないフォントのみフィルタリング
   const unloadedFonts = fonts.filter((font) => !loadedFonts.value.has(font.family));

   if (unloadedFonts.length === 0) {
    return true;
   }

   const fontUrl = generateFontUrl(unloadedFonts);

   // link要素を作成してフォントを読み込み
   const link = document.createElement('link');
   link.rel = 'stylesheet';
   link.href = fontUrl;

   return new Promise((resolve) => {
    link.onload = () => {
     // 読み込み完了したフォントを記録
     unloadedFonts.forEach((font) => {
      loadedFonts.value.add(font.family);

      // CSSクラスを動的に追加
      const className = getFontClassName(font.family);
      addFontClass(className, font.family);
     });

     isLoading.value = false;
     resolve(true);
    };

    link.onerror = () => {
     console.error(`Failed to load fonts: ${fontUrl}`);
     isLoading.value = false;
     resolve(false);
    };

    document.head.appendChild(link);
   });
  } catch (error) {
   console.error('Error loading fonts:', error);
   isLoading.value = false;
   return false;
  }
 };

 // CSSクラスを動的に追加
 const addFontClass = (className: string, fontFamily: string) => {
  const existingStyle = document.querySelector(`#font-${className}`);
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = `font-${className}`;
  style.textContent = `
      .${className} {
        font-family: '${fontFamily}', sans-serif;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
      }
    `;
  document.head.appendChild(style);
 };

 // フォント名からスタイルオブジェクトを取得
 const getFontStyle = (fontFamily: string): Record<string, string> => {
  // フォントが読み込まれていない場合は読み込みを試行
  if (!loadedFonts.value.has(fontFamily)) {
   loadFont(fontFamily);
   return { fontFamily: 'sans-serif' }; // フォールバック
  }

  return {
   fontFamily: `'${fontFamily}', sans-serif`,
   textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)'
  };
 };

 // フォント名からクラス名を取得（読み込み済みかチェック）
 const getFontClass = (fontFamily: string): string => {
  const className = getFontClassName(fontFamily);

  // フォントが読み込まれていない場合は読み込みを試行
  if (!loadedFonts.value.has(fontFamily)) {
   loadFont(fontFamily);
   return 'font-sans'; // フォールバック
  }

  return className;
 };

 // 利用可能なフォント一覧
 const availableFonts = computed(() => Object.keys(commonFonts));

 // 初期化
 onMounted(() => {
  // デフォルトフォントを読み込み
  loadFonts([commonFonts['RocknRoll One'], commonFonts['Mochiy Pop P One']]);
 });

 return {
  loadedFonts: computed(() => Array.from(loadedFonts.value)),
  isLoading: computed(() => isLoading.value),
  availableFonts,
  loadFont,
  loadFonts,
  getFontClass,
  getFontStyle,
  getFontClassName,
  commonFonts: computed(() => commonFonts)
 };
}
