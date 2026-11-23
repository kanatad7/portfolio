"use client";
import {useRef,useState} from 'react';
import {RichBody} from '@/components/rich-body';
export function SkillsEditor({value,onChange}:{value:string;onChange:(v:string)=>void}){
 const input=useRef<HTMLTextAreaElement>(null);const [preview,setPreview]=useState(false);
 function format(before:string,after=before){const el=input.current;if(!el)return;const a=el.selectionStart,b=el.selectionEnd;const selection=value.slice(a,b);onChange(value.slice(0,a)+before+selection+after+value.slice(b));requestAnimationFrame(()=>{el.focus();el.setSelectionRange(a+before.length,a+before.length+selection.length)})}
 function prefix(token:string){const el=input.current;if(!el)return;const a=el.selectionStart,b=el.selectionEnd;const start=value.lastIndexOf('\n',a-1)+1;const end=value.indexOf('\n',b);const stop=end===-1?value.length:end;const affected=value.slice(start,stop).split('\n').map(s=>token+s).join('\n');onChange(value.slice(0,start)+affected+value.slice(stop));requestAnimationFrame(()=>el.focus())}
 return <div className="skills-editor"><div className="skills-toolbar"><button type="button" onClick={()=>format('**')} aria-label="Bold"><strong>B</strong></button><button type="button" onClick={()=>format('*')} aria-label="Italic"><em>I</em></button><button type="button" onClick={()=>prefix('- ')} aria-label="Bullet list">• List</button><button type="button" onClick={()=>prefix('1. ')} aria-label="Numbered list">1. List</button><button type="button" onClick={()=>setPreview(v=>!v)}>{preview?'Edit':'Preview'}</button></div>{preview?<div className="skills-preview"><RichBody body={value}/></div>:<textarea ref={input} rows={10} value={value} onChange={e=>onChange(e.target.value)}/>}<small>文字を選択して太字・斜体を設定できます。既存テキストはそのまま保持されます。</small></div>
}
