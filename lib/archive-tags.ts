/** Multiple Archive tags stored in the existing category text column. Legacy single categories remain valid. */
export function archiveTags(category:string|null|undefined):string[]{return [...new Set((category||'').split('|').map(s=>s.trim()).filter(Boolean))]}
export function joinArchiveTags(tags:string[]):string{return [...new Set(tags.map(x=>x.trim()).filter(Boolean))].join(' | ')}
