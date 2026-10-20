import {ProjectLink} from '@/lib/data';
import {ArrowUpRight} from 'lucide-react';
export function ProjectLinks({links,lang}:{links?:ProjectLink[];lang:'en'|'ja'|'zh'}){
 const safe=(links||[]).filter(x=>x&&x.label?.trim()&&/^https?:\/\//i.test(x.url?.trim()||''));
 if(!safe.length)return null;
 return <section className="project-links"><h2>{lang==='ja'?'関連リンク':lang==='zh'?'相關連結':'Links'}</h2>{safe.map((link,i)=><a key={i} href={link.url.trim()} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={16}/></a>)}</section>;
}
