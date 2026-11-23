"use client";
import {useState} from 'react';
import {archiveTags,joinArchiveTags} from '@/lib/archive-tags';
export function ArchiveTagsEditor({value,available,onChange}:{value:string;available:string[];onChange:(value:string)=>void}){
 const [newTag,setNewTag]=useState('');const selected=archiveTags(value);const options=[...new Set([...available,...selected])].sort((a,b)=>a.localeCompare(b));
 const toggle=(tag:string)=>onChange(joinArchiveTags(selected.includes(tag)?selected.filter(t=>t!==tag):[...selected,tag]));
 const add=()=>{const tag=newTag.trim().replaceAll('|',' / ');if(tag)onChange(joinArchiveTags([...selected,tag]));setNewTag('')};
 return <div className="archive-tags-editor"><strong>Category / Tags (multiple)</strong><div className="archive-tags-options">{options.map(t=><label key={t}><input type="checkbox" checked={selected.includes(t)} onChange={()=>toggle(t)}/>{t}</label>)}</div><div className="archive-new-tag"><input value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}} placeholder="New tag"/><button type="button" className="ghost-btn" onClick={add}>+ Add tag</button></div><small>チェックで複数選択できます。既存タグはそのまま利用できます。</small></div>
}
