"use client";
import {useEffect,useState} from 'react';
import {useLanguage} from '@/components/site';
import {ui} from '@/lib/data';
import {supabase} from '@/lib/supabase';
import {Profile,translated} from '@/lib/profile';
const headings={en:{experience:'Experience',education:'Education',skills:'Skills',contact:'Contact'},ja:{experience:'経歴・活動',education:'学歴',skills:'スキル',contact:'連絡先'},zh:{experience:'經歷與活動',education:'學歷',skills:'技能',contact:'聯絡方式'}};
export default function Page(){
 const {lang}=useLanguage();const t=ui[lang];const h=headings[lang];
 const [profile,setProfile]=useState<Profile|null>(null);
 useEffect(()=>{let active=true;const db=supabase();if(db)db.from('site_profile').select('*').eq('id','main').maybeSingle().then(({data})=>{if(active&&data)setProfile(data as Profile)});return()=>{active=false}},[]);
 const intro=profile?translated(profile,'intro',lang):'';
 const sections=profile?(['experience','education','skills'] as const).map(key=>({key,content:translated(profile,key,lang)})).filter(s=>s.content):[];
 return <section className="wrap section-page about-layout"><div><span className="overline">PROFILE / PERSONAL ARCHIVE</span><h1>{t.aboutTitle}<span className="title-period">.</span></h1><p className="detail-lead about-multiline">{intro||t.aboutBody}</p>
 {profile?<>{sections.map(s=><section key={s.key} className="about-section"><h2>{h[s.key]}</h2><p className="about-multiline">{s.content}</p></section>)}{(profile.email||profile.website||profile.instagram)&&<section className="about-section"><h2>{h.contact}</h2><div className="about-links">{profile.email&&<a href={`mailto:${profile.email}`}>{profile.email}</a>}{profile.website&&<a href={profile.website} target="_blank" rel="noopener noreferrer">Website ↗</a>}{profile.instagram&&<a href={profile.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}</div></section>}</>:<><p>{t.cvBody}</p><h2>{h.experience}</h2><div className="timeline"><div><span>2026 —</span><h3>Hong Kong</h3><p>Urban field research / local practice</p></div><div><span>Japan</span><h3>Maizuru, Kyoto</h3><p>Spatial design / community spaces / renovation</p></div></div><h2>{t.researchStatement}</h2><p>{t.researchBody}</p></>}</div>
 <div className="profile-art">{profile?.photo_url?<img src={profile.photo_url} alt="Profile portrait" className="about-profile-photo"/>:<span>DESIGN<br/>RESEARCH<br/>PRACTICE</span>}</div></section>
}
