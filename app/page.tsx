"use client";
import {useEffect,useState} from 'react';
import {useLanguage} from '@/components/site';
import {EntryCard,useEntries} from '@/components/archive';
import {supabase} from '@/lib/supabase';
import {emptyHome,HomeSettings,homeText} from '@/lib/home';
export default function Home(){const {lang}=useLanguage();const {entries,loading}=useEntries();const [home,setHome]=useState<HomeSettings>(emptyHome);
 useEffect(()=>{let alive=true;const db=supabase();if(db)db.from('home_settings').select('*').eq('id','main').maybeSingle().then(({data,error})=>{if(alive&&!error&&data)setHome({...emptyHome,...data} as HomeSettings)});return()=>{alive=false}},[]);
 const selected=home.featured_ids.length?home.featured_ids.map(id=>entries.find(item=>item.id===id)).filter((item):item is typeof entries[number]=>Boolean(item)):entries;
 return <><section className="wrap home-intro"><span className="overline">INDEPENDENT PRACTICE & RESEARCH</span><h1>{homeText(home,'headline',lang)}</h1><p>{homeText(home,'description',lang)}</p></section><section className="wrap home-feed"><div className="home-feed-heading"><span className="overline">SELECTED / WORKS · ARCHIVE · RESEARCH</span></div><div className="home-mixed-grid">{selected.map(item=><EntryCard key={item.id} item={item}/>)}</div>{!loading&&!selected.length&&<p>New projects coming soon.</p>}</section></>}
