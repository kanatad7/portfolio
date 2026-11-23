"use client";
import {useEffect,useRef,useState} from 'react';
import {Bold,Italic,List,Link2,ImagePlus,Heading2,Heading3,AlignLeft,LoaderCircle} from 'lucide-react';

/** The persisted format stays Markdown, so existing articles and the public renderer remain compatible. */
const safeUrl=(value:string)=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}};
function appendInline(parent:HTMLElement,text:string){
 const pattern=/(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;let last=0;
 for(const m of text.matchAll(pattern)){
  const i=m.index??0;if(i>last)parent.append(document.createTextNode(text.slice(last,i)));
  if(m[2]){const el=document.createElement('strong');el.textContent=m[2];parent.append(el)}
  else if(m[3]){const el=document.createElement('em');el.textContent=m[3];parent.append(el)}
  else{const href=safeUrl(m[5]);if(href){const el=document.createElement('a');el.href=href;el.textContent=m[4];parent.append(el)}else parent.append(document.createTextNode(m[0]))}
  last=i+m[0].length;
 }if(last<text.length)parent.append(document.createTextNode(text.slice(last)));
}
function populateEditor(root:HTMLElement,source:string){
 root.replaceChildren();const lines=source.replace(/\r/g,'').split('\n');let list:HTMLUListElement|null=null;
 for(const raw of lines){const text=raw.trim();
  if(!text){const p=document.createElement('p');p.append(document.createElement('br'));root.append(p);list=null;continue}
  const image=text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if(image&&safeUrl(image[2])){const figure=document.createElement('figure');figure.className='visual-image';const img=document.createElement('img');img.src=safeUrl(image[2])!;img.alt=image[1];img.contentEditable='false';figure.append(img);const caption=document.createElement('figcaption');caption.textContent=image[1];caption.dataset.placeholder='画像の説明を入力（任意）';figure.append(caption);root.append(figure);list=null;continue}
  if(/^[-*] /.test(text)){if(!list){list=document.createElement('ul');root.append(list)}const li=document.createElement('li');appendInline(li,text.slice(2));list.append(li);continue}list=null;
  const tag=text.startsWith('### ')?'h3':/^#{1,2} /.test(text)?'h2':'p';const el=document.createElement(tag);appendInline(el,text.replace(/^#{1,3} /,''));root.append(el);
 }if(!root.childNodes.length){root.append(document.createElement('p'))}
}
function textMarkdown(node:Node):string{
 if(node.nodeType===Node.TEXT_NODE)return node.textContent||'';
 if(!(node instanceof HTMLElement))return '';
 const inner=()=>Array.from(node.childNodes).map(textMarkdown).join('');
 switch(node.tagName){case 'STRONG':case 'B':return `**${inner()}**`;case 'EM':case 'I':return `*${inner()}*`;
 case 'A':{const url=safeUrl(node.getAttribute('href')||'');return url?`[${inner()}](${url})`:inner()}
 case 'BR':return '';default:return inner()}
}
function serialize(root:HTMLElement){const blocks:string[]=[];
 function push(node:HTMLElement){const tag=node.tagName;
  if(tag==='FIGURE'){const img=node.querySelector('img');const url=safeUrl(img?.getAttribute('src')||'');if(url){const caption=node.querySelector('figcaption')?.textContent?.replace(/[\]\n]/g,' ').trim()||'';blocks.push(`![${caption}](${url})`)}return}
  if(tag==='UL'||tag==='OL'){node.querySelectorAll(':scope > li').forEach(li=>blocks.push(`- ${textMarkdown(li)}`));return}
  const text=textMarkdown(node).trim();if(tag==='H2')blocks.push('## '+text);else if(tag==='H3')blocks.push('### '+text);else blocks.push(text);
 }
 Array.from(root.children).forEach(c=>push(c as HTMLElement));return blocks.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function VisualBodyEditor({value,onChange,onUpload,disabled}:{value:string;onChange:(s:string)=>void;onUpload:(f:File)=>Promise<string|null>;disabled?:boolean}){
 const root=useRef<HTMLDivElement>(null);const fileRef=useRef<HTMLInputElement>(null);const lastEmitted=useRef<string|null>(null);const savedRange=useRef<Range|null>(null);const [uploading,setUploading]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{if(root.current&&value!==lastEmitted.current){populateEditor(root.current,value||'');lastEmitted.current=value}},[value]);
 const commit=()=>{if(!root.current)return;const next=serialize(root.current);lastEmitted.current=next;onChange(next)};
 const focus=()=>root.current?.focus();
 const command=(cmd:string,arg?:string)=>{focus();document.execCommand(cmd,false,arg);commit()};
 const block=(tag:'p'|'h2'|'h3')=>command('formatBlock',tag);
 const addLink=()=>{const url=window.prompt('リンク先URL（https://...）');if(!url)return;const safe=safeUrl(url.trim());if(!safe){setError('https:// または http:// のURLを入力してください。');return}setError('');focus();const selected=window.getSelection()?.toString();if(selected)document.execCommand('createLink',false,safe);else document.execCommand('insertHTML',false,`<a href="${safe.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">${safe.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</a>`);commit()};
 const startUpload=()=>{savedRange.current=null;const selection=window.getSelection();if(selection?.rangeCount&&root.current?.contains(selection.anchorNode))savedRange.current=selection.getRangeAt(0).cloneRange();fileRef.current?.click()};
 /** Insert an image as a top-level block. Nested figures inside paragraphs were lost by serialize(). */
 const insertFigure=(editor:HTMLElement,figure:HTMLElement,after:HTMLElement,range:Range|null)=>{
  if(!range||!editor.contains(range.commonAncestorContainer)){editor.append(figure,after);return}
  range.deleteContents();range.insertNode(figure);
  // Split each enclosing block without throwing away text before/after the caret.
  while(figure.parentElement&&figure.parentElement!==editor){
   const parent=figure.parentElement;
   const tail=parent.cloneNode(false) as HTMLElement;
   while(figure.nextSibling)tail.append(figure.nextSibling);
   parent.after(figure);
   if(tail.hasChildNodes())figure.after(tail);
   if(!parent.hasChildNodes())parent.remove();
  }
  figure.after(after);
 };
 const upload=async(file?:File)=>{if(!file)return;setUploading(true);setError('');try{const url=await onUpload(file);if(!url){setError('画像をアップロードできませんでした。');return}const editor=root.current;if(!editor)return;editor.focus();const figure=document.createElement('figure');figure.className='visual-image';const image=document.createElement('img');image.src=url;image.alt='';image.contentEditable='false';figure.append(image);const caption=document.createElement('figcaption');caption.dataset.placeholder='画像の説明を入力（任意）';figure.append(caption);caption.contentEditable='true';const p=document.createElement('p');p.append(document.createElement('br'));insertFigure(editor,figure,p,savedRange.current);savedRange.current=null;commit();caption.focus()}catch{setError('画像を挿入できませんでした。')}finally{setUploading(false)}};
 return <div className="visual-editor">
 <div className="visual-toolbar" role="toolbar" aria-label="本文の書式設定">
  <div className="visual-toolbar-group"><button type="button" title="本文" aria-label="本文" onMouseDown={e=>e.preventDefault()} onClick={()=>block('p')}><AlignLeft size={17}/></button><button type="button" title="大見出し" aria-label="大見出し" onMouseDown={e=>e.preventDefault()} onClick={()=>block('h2')}><Heading2 size={18}/></button><button type="button" title="小見出し" aria-label="小見出し" onMouseDown={e=>e.preventDefault()} onClick={()=>block('h3')}><Heading3 size={18}/></button></div>
  <div className="visual-toolbar-group"><button type="button" title="太字" aria-label="太字" onMouseDown={e=>e.preventDefault()} onClick={()=>command('bold')}><Bold size={17}/></button><button type="button" title="斜体" aria-label="斜体" onMouseDown={e=>e.preventDefault()} onClick={()=>command('italic')}><Italic size={17}/></button><button type="button" title="箇条書き" aria-label="箇条書き" onMouseDown={e=>e.preventDefault()} onClick={()=>command('insertUnorderedList')}><List size={17}/></button><button type="button" title="リンク" aria-label="リンクを挿入" onMouseDown={e=>e.preventDefault()} onClick={addLink}><Link2 size={17}/></button></div>
  <button type="button" className="visual-insert-image" disabled={disabled||uploading} onMouseDown={e=>e.preventDefault()} onClick={startUpload}>{uploading?<LoaderCircle size={17}/>:<ImagePlus size={17}/>} {uploading?'アップロード中…':'画像を挿入'}</button>
  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={e=>{const file=e.target.files?.[0];e.target.value='';void upload(file)}}/>
 </div>
 <div ref={root} className="visual-editable rich-body" contentEditable={!disabled} suppressContentEditableWarning role="textbox" aria-label="本文を直接編集" aria-multiline="true" data-placeholder="ここに本文を入力してください…" onInput={commit} onBlur={commit} onPaste={e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))}}/>
 {error&&<p className="visual-error" role="alert">{error}</p>}
 <p className="visual-help">文字を選択して書式を適用できます。画像はカーソルの位置に挿入し、下にキャプションを入力できます。公開には「Save entry」が必要です。</p>
 </div>
}
