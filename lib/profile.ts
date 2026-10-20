export type ProfileLang = 'en'|'ja'|'zh';
export type Profile = {id:string; photo_url:string; email:string; website:string; instagram:string; updated_at?:string} & Record<`intro_${ProfileLang}`|`experience_${ProfileLang}`|`education_${ProfileLang}`|`skills_${ProfileLang}`,string>;
export const emptyProfile:Profile={id:'main',photo_url:'',email:'',website:'',instagram:'',intro_en:'',intro_ja:'',intro_zh:'',experience_en:'',experience_ja:'',experience_zh:'',education_en:'',education_ja:'',education_zh:'',skills_en:'',skills_ja:'',skills_zh:''};
export function translated(p:Profile, key:'intro'|'experience'|'education'|'skills',lang:ProfileLang){return p[`${key}_${lang}`]||p[`${key}_en`]||p[`${key}_ja`]||'';}
