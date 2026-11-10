import type {CVItem,Phase} from './profile';
export type DateItem={period?:string;start_year?:number|null;start_month?:number|null;end_year?:number|null;end_month?:number|null;ongoing?:boolean};
export function yearsFromLabel(period?:string){const yy=(period||'').match(/(?:19|20)\d{2}/g)||[];return {start:yy.length?Number(yy[0]):null,end:yy.length>1?Number(yy[yy.length-1]):null};}
export function inferredOngoing(value:DateItem){if(typeof value.ongoing==='boolean')return value.ongoing;return /(?:present|current|ongoing|現在|至今|継続中|[–—-]\s*$)/i.test(value.period||'');}
export function startOf(value:DateItem){const y=value.start_year??yearsFromLabel(value.period).start;return y===null?null:y+(value.start_month?((value.start_month-1)/12):0);}
export function endOf(value:DateItem,now:Date){if(inferredOngoing(value))return now.getFullYear()+now.getMonth()/12;const y=value.end_year??yearsFromLabel(value.period).end;return y===null?null:y+(value.end_month?(value.end_month/12):1);}
export function rangeForPhase(phase:Phase,items:CVItem[],now:Date){
 const starts=[startOf(phase),...items.map(startOf)].filter((x):x is number=>x!==null);
 const start=phase.start_year??yearsFromLabel(phase.period).start??(starts.length?Math.floor(Math.min(...starts)):now.getFullYear());
 const phaseEnd=phase.end_year??yearsFromLabel(phase.period).end;
 const activityEnds=items.map(i=>endOf(i,now)).filter((x):x is number=>x!==null);
 const hasOngoing=items.some(inferredOngoing);
 const mode=phase.timeline_mode||'auto';
 let lastYear:number;
 if(mode==='manual'&&phase.timeline_end_year)lastYear=phase.timeline_end_year;
 else if(mode==='ended')lastYear=phaseEnd??(activityEnds.length?Math.ceil(Math.max(...activityEnds))-1:start);
 else if(mode==='ongoing'||hasOngoing)lastYear=Math.max(now.getFullYear(),phaseEnd||start);
 else lastYear=Math.max(phaseEnd||start,...activityEnds.map(n=>Math.ceil(n)-1));
 return {start, end:Math.max(start,lastYear), hasOngoing:mode==='ongoing'||(mode==='auto'&&hasOngoing)};
}
export function timelineBar(item:DateItem,startYear:number,lastYear:number,now:Date){const span=Math.max(1,lastYear-startYear+1);const from=startOf(item);const to=endOf(item,now);if(from===null||to===null)return null;const left=Math.max(0,Math.min(100,(from-startYear)/span*100));const right=Math.max(0,Math.min(100,(to-startYear)/span*100));if(right<=left)return null;return {left:`${left}%`,width:`${right-left}%`};}
export function yearLabel(item:DateItem,lang:'en'|'ja'|'zh',now:Date){const s=item.start_year??yearsFromLabel(item.period).start;const e=item.end_year??yearsFromLabel(item.period).end;const present=lang==='ja'?'現在':lang==='zh'?'至今':'Present';return s?`${s}–${inferredOngoing(item)?present:(e??'')}`:(item.period||'');}
