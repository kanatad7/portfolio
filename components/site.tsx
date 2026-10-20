"use client";
import {createContext,useContext,useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {Lang,ui} from '@/lib/data';
const LanguageContext=createContext<{lang:Lang,setLang:(v:Lang)=>void}>({lang:'en',setLang:()=>{}});
export const useLanguage=()=>useContext(LanguageContext);
export function Shell({children}:{children:React.ReactNode}){
 const [lang,setLang]=useState<Lang>('en');const [menu,setMenu]=useState(false);const path=usePathname();
 useEffect(()=>{const saved=localStorage.getItem('archive-lang') as Lang|null;if(saved&&['en','ja','zh'].includes(saved))setLang(saved);},[]);
 const change=(v:Lang)=>{setLang(v);localStorage.setItem('archive-lang',v)};
 const t=ui[lang];const nav=[['/works',t.works],['/archive',lang==='zh'?'檔案':'Archive'],['/research',t.research],['/about',t.about]];
 return <LanguageContext.Provider value={{lang,setLang:change}}><div className="page-shell"><header className="header"><Link href="/" className="brand" onClick={()=>setMenu(false)}>HIROKI TANAKA<span className="brand-dot">●</span></Link><nav className={menu?'nav open':'nav'}>{nav.map(([href,label])=><Link className={path===href||path.startsWith(href+'/')?'active':''} href={href} key={href} onClick={()=>setMenu(false)}>{label}</Link>)}</nav><div className="header-actions"><div className="lang" aria-label="Language">{(['en','ja','zh'] as Lang[]).map(v=><button key={v} className={lang===v?'selected':''} onClick={()=>change(v)}>{v==='zh'?'繁':v.toUpperCase()}</button>)}</div><button className="mobile-toggle" aria-label="Menu" onClick={()=>setMenu(!menu)}>{menu?<X size={23}/>:<Menu size={23}/>}</button></div></header><main>{children}</main><footer className="footer"><span>© {new Date().getFullYear()} HIROKI TANAKA</span><span>DESIGN · RESEARCH · ARCHIVE</span><Link href="/admin">{t.admin} <ArrowUpRight size={14}/></Link></footer></div></LanguageContext.Provider>;
}
