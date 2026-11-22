import {Lang} from './data';
export type HomeSettings = {id:string; headline_en:string;headline_ja:string;headline_zh:string;description_en:string;description_ja:string;description_zh:string;featured_ids:string[]};
export const emptyHome:HomeSettings={id:'main',headline_en:'Spaces, people, and ways of making.',headline_ja:'空間、人、つくること。',headline_zh:'空間、人與創造的方式。',description_en:'Spatial design, everyday making, and research between Japan and Hong Kong.',description_ja:'日本と香港を横断する空間デザイン、制作とリサーチ。',description_zh:'橫跨日本與香港的空間設計、創作與研究。',featured_ids:[]};
export function homeText(h:HomeSettings,key:'headline'|'description',lang:Lang){return h[`${key}_${lang}`]||h[`${key}_en`]||''}
