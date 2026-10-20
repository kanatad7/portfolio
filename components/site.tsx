"use client";
import {createContext,useContext,useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {Lang,ui} from '@/lib/data';
import {supabase} from '@/lib/supabase';
import {Profile} from '@/lib/profile';
const LanguageContext=createContext<{lang:Lang,setLang:(v:Lang)=>void}>({lang:'en',setLang:()=>{}});
export const useLanguage=()=>useContext(LanguageContext);
export function Shell({children}:{children:React.ReactNode}){
 const [footerProfile,setFooterProfile]=useState<Profile|null>(null);
 useEffect(()=>{let live=true;const db=supabase();if(db)db.from('site_profile').select('*').eq('id','main').maybeSingle().then(({data,error})=>{if(live&&!error&&data)setFooterProfile(data as Profile)});return()=>{live=false}},[]);
 const [lang,setLang]=useState<Lang>('en');const [menu,setMenu]=useState(false);const path=usePathname();
 useEffect(()=>{const saved=localStorage.getItem('archive-lang') as Lang|null;if(saved&&['en','ja','zh'].includes(saved))setLang(saved);},[]);
 const change=(v:Lang)=>{setLang(v);localStorage.setItem('archive-lang',v)};
 const t=ui[lang];const nav=[['/works',t.works],['/archive',lang==='zh'?'檔案':'Archive'],['/research',t.research],['/about',t.about]];
 return <LanguageContext.Provider value={{lang,setLang:change}}><div className="page-shell"><header className="header"><Link href="/" className="brand" onClick={()=>setMenu(false)}>HIROKI TANAKA<span className="brand-dot">●</span></Link><nav className={menu?'nav open':'nav'}>{nav.map(([href,label])=><Link className={path===href||path.startsWith(href+'/')?'active':''} href={href} key={href} onClick={()=>setMenu(false)}>{label}</Link>)}</nav><div className="header-actions"><div className="lang" aria-label="Language">{(['en','ja','zh'] as Lang[]).map(v=><button key={v} className={lang===v?'selected':''} onClick={()=>change(v)}>{v==='zh'?'繁':v.toUpperCase()}</button>)}</div><button className="mobile-toggle" aria-label="Menu" onClick={()=>setMenu(!menu)}>{menu?<X size={23}/>:<Menu size={23}/>}</button></div></header><main>{children}</main><footer className="footer"><span>© {new Date().getFullYear()} HIROKI TANAKA</span><div className="footer-social" aria-label="Social and contact links">{(footerProfile?.footer_links?.length?footerProfile.footer_links:[...(footerProfile?.instagram?[{id:'instagram',label:'Instagram',url:footerProfile.instagram}]:[]),...(footerProfile?.linkedin?[{id:'linkedin',label:'LinkedIn',url:footerProfile.linkedin}]:[]),...(footerProfile?.website?[{id:'website',label:'Website',url:footerProfile.website}]:[]),...(footerProfile?.email?[{id:'email',label:'Email',url:`mailto:${footerProfile.email}`}]:[])]).filter(link=>link.label&&/^(https?:\/\/|mailto:)/i.test(link.url)).map(link=><a href={link.url} key={link.id} target={link.url.startsWith('mailto:')?undefined:'_blank'} rel="noopener noreferrer">{link.label}<ArrowUpRight size={14}/></a>)}</div><Link href="/admin">{t.admin} <ArrowUpRight size={14}/></Link></footer></div></LanguageContext.Provider>;
}
