"use client";
import {useEffect,useState} from 'react';
import {useLanguage} from '@/components/site';
import {ui,ArchiveItem} from '@/lib/data';
import {supabase} from '@/lib/supabase';
import {Profile,Phase,CVItem,translated,localText,safeActivityUrl,activityName} from '@/lib/profile';
import {rangeForPhase,timelineBar,inferredOngoing,yearLabel} from '@/lib/timeline';

const labels={en:{experience:'Experience & Practice',education:'Education',skills:'Skills',details:'Details',related:'Related projects & links',unassigned:'Other experiences',ongoing:'Present',continued:'Also associated with this phase'},ja:{experience:'経歴・活動・研究',education:'学歴',skills:'スキル',details:'詳細を見る',related:'関連作品・リンク',unassigned:'その他の経歴',ongoing:'現在',continued:'このフェーズにも関連する活動'},zh:{experience:'經歷、實踐與研究',education:'學歷',skills:'技能',details:'查看詳情',related:'相關作品與連結',unassigned:'其他經歷',ongoing:'至今',continued:'亦與此階段相關'}};
function Activity({item,lang,entries,phase,range,now,also=false}:{item:CVItem;lang:'en'|'ja'|'zh';entries:ArchiveItem[];phase?:Phase;range?:{start:number;end:number};now:Date;also?:boolean}){
 const [open,setOpen]=useState(false);
 const h=labels[lang];const role=localText(item as unknown as Record<string,unknown>,'role',lang);
 const summary=localText(item as unknown as Record<string,unknown>,'description',lang);
 const detail=localText(item as unknown as Record<string,unknown>,'detail',lang);
 const bar=range&&!also?timelineBar(item,range.start,range.end,now):null;
 const parts=(item.related_entry_ids||[]).map(id=>entries.find(e=>e.id===id)).filter((e):e is ArchiveItem=>!!e&&e.published);
 const links=(item.links||[]).map(l=>({...l,href:safeActivityUrl(l.url)})).filter(l=>l.href);
 return <article className="phase-activity"><button type="button" className="activity-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>
 <span className="activity-label"><span className="activity-name">{activityName(item,lang)}</span><span className="activity-role">{role}</span><span className="activity-period">{yearLabel(item,lang,now)}</span></span>
 {bar?<span className="activity-chart" aria-label={yearLabel(item,lang,now)} style={{backgroundSize:`${100/Math.max(1,range!.end-range!.start+1)}% 100%`}}><span className="activity-bar" style={bar}/></span>:<span className="activity-kind">{(item.kind||'work').toUpperCase()}</span>}
 <span className="activity-chevron" aria-hidden="true">{open?'−':'+'}</span></button>
 {open&&<div className="activity-expanded"><span className="activity-category">{(item.kind||'work').toUpperCase()}</span>{summary&&<p>{summary}</p>}{detail&&<p className="activity-detail">{detail}</p>}{!summary&&!detail&&<p className="activity-detail">{role}</p>}
 {(parts.length>0||links.length>0)&&<><strong className="activity-related-title">{h.related}</strong><div className="activity-related">{parts.map(e=><a key={e.id} href={e.section==='archive'?`/archive?item=${encodeURIComponent(e.slug)}`:`/${e.section}/${e.slug}`} className="related-link">{e.title_en||e.title_ja||e.slug} <span aria-hidden="true">↗</span></a>)}{links.map(l=><a key={l.id} href={l.href!} className="related-link" target={l.href!.startsWith('mailto:')?undefined:'_blank'} rel="noopener noreferrer">{l.label||l.url} <span aria-hidden="true">↗</span></a>)}</div></>}
 </div>}</article>;
}
function PhasePanel({phase,index,activities,entries,lang,now}:{phase:Phase;index:number;activities:CVItem[];entries:ArchiveItem[];lang:'en'|'ja'|'zh';now:Date}){
 const title=localText(phase as unknown as Record<string,unknown>,'title',lang);const description=localText(phase as unknown as Record<string,unknown>,'description',lang);const name=localText(phase as unknown as Record<string,unknown>,'name',lang);
 const primary=activities.filter(a=>(a.phase_ids||[]).includes(phase.id)&&(!a.primary_phase_id||a.primary_phase_id===phase.id||!(a.phase_ids||[]).includes(a.primary_phase_id)));
 const also=activities.filter(a=>(a.phase_ids||[]).includes(phase.id)&&a.primary_phase_id&&a.primary_phase_id!==phase.id&&(a.phase_ids||[]).includes(a.primary_phase_id));
 const range=rangeForPhase(phase,primary,now);
 const yearCount=range.end-range.start+1;
 const years=yearCount<=16?Array.from({length:yearCount},(_,i)=>range.start+i):[];
 const period=`${range.start}–${range.hasOngoing?labels[lang].ongoing:range.end}`;
 return <section className="phase-section"><div className="phase-heading"><h3>{String(index+1).padStart(2,'0')} / {name}</h3><span>{period}</span></div><div className="phase-description"><h4>{title}</h4>{description&&<p>{description}</p>}</div>
 {primary.length>0&&years.length>0&&<div className="phase-chart-heading"><span>ACTIVITY / ROLE</span><div className="phase-years" style={{gridTemplateColumns:`repeat(${years.length},minmax(0,1fr))`}}>{years.map(y=><span key={y}>{y}</span>)}</div><span/></div>}
 {primary.map(a=><Activity key={a.id} item={a} phase={phase} range={range} now={now} lang={lang} entries={entries}/>)}
 {also.length>0&&<div className="phase-also"><small>{labels[lang].continued}</small>{also.map(a=><Activity key={a.id} item={a} now={now} lang={lang} entries={entries} also/>)}</div>}
 </section>;
}
export default function Page(){const {lang}=useLanguage();const t=ui[lang];const h=labels[lang];const [profile,setProfile]=useState<Profile|null>(null);const [entries,setEntries]=useState<ArchiveItem[]>([]);const [now]=useState(()=>new Date());
 useEffect(()=>{let active=true;const db=supabase();if(db){db.from('site_profile').select('*').eq('id','main').maybeSingle().then(({data})=>{if(active&&data)setProfile(data as Profile)});db.from('entries').select('*').eq('published',true).then(({data})=>{if(active)setEntries((data||[]) as ArchiveItem[])})}return()=>{active=false}},[]);
 const intro=profile?translated(profile,'intro',lang):'';const activities=profile?.career_items||[];const phases=profile?.phase_items||[];const orphan=activities.filter(a=>!(a.phase_ids||[]).some(id=>phases.some(p=>p.id===id)));
 return <section className="wrap section-page about-layout"><div className="about-content"><span className="overline">ABOUT / PROFILE</span><h1>{t.aboutTitle}<span className="title-period">.</span></h1><p className="about-intro">{intro||t.aboutBody}</p>
 {profile?<>{(phases.length>0||activities.length>0||translated(profile,'experience',lang))&&<section className="about-section"><h2>{h.experience}</h2>{phases.map((p,i)=><PhasePanel key={p.id} phase={p} index={i} activities={activities} lang={lang} entries={entries} now={now}/>)}{orphan.length>0&&<div className="phase-section"><h3>{phases.length?h.unassigned:''}</h3>{orphan.map(item=><Activity key={item.id} item={item} lang={lang} entries={entries} now={now}/>)}</div>}{activities.length===0&&phases.length===0&&<p className="about-multiline">{translated(profile,'experience',lang)}</p>}</section>}
 {((profile.education_items||[]).length>0||translated(profile,'education',lang))&&<section className="about-section"><h2>{h.education}</h2>{(profile.education_items||[]).length>0?(profile.education_items||[]).map(item=><Activity key={item.id} item={item} lang={lang} entries={entries} now={now}/>):<p className="about-multiline">{translated(profile,'education',lang)}</p>}</section>}{translated(profile,'skills',lang)&&<section className="about-section"><h2>{h.skills}</h2><p className="about-multiline">{translated(profile,'skills',lang)}</p></section>}</>:<p>{t.cvBody}</p>}</div><div className="profile-art">{profile?.photo_url?<img src={profile.photo_url} alt="Profile portrait" className="about-profile-photo"/>:<span>DESIGN<br/>RESEARCH<br/>PRACTICE</span>}</div></section>;
}
