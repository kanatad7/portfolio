export type CVItem = {id:string; period:string; name:string; role_en:string; role_ja:string; role_zh:string; description_en:string; description_ja:string; description_zh:string};
export type FooterLink = {id:string;label:string;url:string};
export type ProfileLang = 'en'|'ja'|'zh';
export type Profile = {id:string; photo_url:string; email:string; website:string; instagram:string; linkedin:string; career_items?:CVItem[]; education_items?:CVItem[]; footer_links?:FooterLink[]; updated_at?:string} & Record<`intro_${ProfileLang}`|`experience_${ProfileLang}`|`education_${ProfileLang}`|`skills_${ProfileLang}`,string>;
export const emptyProfile:Profile={id:'main',photo_url:'',email:'',website:'',instagram:'',linkedin:'',career_items:[],education_items:[],footer_links:[],intro_en:'',intro_ja:'',intro_zh:'',experience_en:'',experience_ja:'',experience_zh:'',education_en:'',education_ja:'',education_zh:'',skills_en:'',skills_ja:'',skills_zh:''};
export function translated(p:Profile, key:'intro'|'experience'|'education'|'skills',lang:ProfileLang){return p[`${key}_${lang}`]||p[`${key}_en`]||p[`${key}_ja`]||'';}
