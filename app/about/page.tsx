"use client";
import {useEffect,useState} from 'react';
import {useLanguage} from '@/components/site';
import {ui} from '@/lib/data';
import {supabase} from '@/lib/supabase';
import {Profile,CVItem,translated} from '@/lib/profile';
const headings={en:{experience:'Experience',education:'Education',skills:'Skills'},ja:{experience:'経歴・活動',education:'学歴',skills:'スキル'},zh:{experience:'經歷與活動',education:'學歷',skills:'技能'}};
function Career({items,lang}:{items:CVItem[];lang:'en'|'ja'|'zh'}){return <div className="cv-list">{items.map(item=><div className="cv-item" key={item.id}><span className="cv-period">{item.period}</span><div><h3>{item.name}</h3>{(item[`role_${lang}`]||item.role_en)&&<p className="cv-role">{item[`role_${lang}`]||item.role_en}</p>}{(item[`description_${lang}`]||item.description_en)&&<p className="cv-description">{item[`description_${lang}`]||item.description_en}</p>}</div></div>)}</div>}
export default function Page(){const {lang}=useLanguage();const t=ui[lang];const h=headings[lang];const [profile,setProfile]=useState<Profile|null>(null);
 useEffect(()=>{let active=true;const db=supabase();if(db)db.from('site_profile').select('*').eq('id','main').maybeSingle().then(({data})=>{if(active&&data)setProfile(data as Profile)});return()=>{active=false}},[]);
 const intro=profile?translated(profile,'intro',lang):'';return <section className="wrap section-page about-layout"><div className="about-content"><span className="overline">ABOUT / PROFILE</span><h1>{t.aboutTitle}<span className="title-period">.</span></h1><p className="about-intro">{intro||t.aboutBody}</p>
 {profile?<>{(['experience','education'] as const).map(key=>{const items=(key==='experience'?profile.career_items:profile.education_items)||[];const legacy=translated(profile,key,lang);return items.length||legacy?<section className="about-section" key={key}><h2>{h[key]}</h2>{items.length?<Career items={items} lang={lang}/>:<p className="about-multiline">{legacy}</p>}</section>:null})}{translated(profile,'skills',lang)&&<section className="about-section"><h2>{h.skills}</h2><p className="about-multiline">{translated(profile,'skills',lang)}</p></section>}</>:<p>{t.cvBody}</p>}</div><div className="profile-art">{profile?.photo_url?<img src={profile.photo_url} alt="Profile portrait" className="about-profile-photo"/>:<span>DESIGN<br/>RESEARCH<br/>PRACTICE</span>}</div></section>}
