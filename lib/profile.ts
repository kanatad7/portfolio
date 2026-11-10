export type ProfileLang = 'en'|'ja'|'zh';
export type ActivityLink = {id:string;label:string;url:string};
export type Phase = {id:string;name_en:string;name_ja:string;name_zh:string;title_en:string;title_ja:string;title_zh:string;description_en:string;description_ja:string;description_zh:string;period:string;start_year?:number|null;end_year?:number|null;start_month?:number|null;end_month?:number|null;ongoing?:boolean;timeline_mode?:'auto'|'ended'|'ongoing'|'manual';timeline_end_year?:number|null};
export type CVItem = {id:string;period:string;name:string;name_en?:string;name_ja?:string;name_zh?:string;role_en:string;role_ja:string;role_zh:string;description_en:string;description_ja:string;description_zh:string;detail_en?:string;detail_ja?:string;detail_zh?:string;kind?:'work'|'research'|'practice'|'education';start_year?:number|null;end_year?:number|null;start_month?:number|null;end_month?:number|null;ongoing?:boolean;phase_ids?:string[];primary_phase_id?:string;links?:ActivityLink[];related_entry_ids?:string[];show_timeline?:boolean};
export type FooterLink = {id:string;label:string;url:string};
export type Profile = {id:string;photo_url:string;email:string;website:string;instagram:string;linkedin:string;career_items?:CVItem[];education_items?:CVItem[];phase_items?:Phase[];footer_links?:FooterLink[];updated_at?:string} & Record<`intro_${ProfileLang}`|`experience_${ProfileLang}`|`education_${ProfileLang}`|`skills_${ProfileLang}`,string>;
export const emptyProfile:Profile={id:'main',photo_url:'',email:'',website:'',instagram:'',linkedin:'',career_items:[],education_items:[],phase_items:[],footer_links:[],intro_en:'',intro_ja:'',intro_zh:'',experience_en:'',experience_ja:'',experience_zh:'',education_en:'',education_ja:'',education_zh:'',skills_en:'',skills_ja:'',skills_zh:''};
export function translated(p:Profile,key:'intro'|'experience'|'education'|'skills',lang:ProfileLang){return p[`${key}_${lang}`]||p[`${key}_en`]||p[`${key}_ja`]||'';}
export function localText(obj:Record<string,unknown>,key:string,lang:ProfileLang){return String(obj[`${key}_${lang}`]||obj[`${key}_en`]||obj[`${key}_ja`]||'');}
export function safeActivityUrl(url:string){try{const u=new URL(url);return ['https:','http:','mailto:'].includes(u.protocol)?u.href:null}catch{return null}}

/** New multilingual activity titles fall back to the legacy single name, preserving old records. */
export function activityName(item:CVItem,lang:ProfileLang){
 const translatedName=localText(item as unknown as Record<string,unknown>,'name',lang);
 return translatedName || item.name || '';
}
