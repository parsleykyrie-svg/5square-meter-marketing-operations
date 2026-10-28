import {buildPlan,metrics,csv} from './core.mjs';
const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;};
let data,plan,report=[];
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function showPlan(brief){
 plan=buildPlan(brief);$('workflow').replaceChildren();
 const meta=el('div','','plan-meta');meta.append(el('span',`${plan.market} / ${plan.audience} / ${plan.channel}`,'eyebrow'),el('span','Draft · human review required','badge'));$('workflow').append(meta,el('h3',plan.topic));
 const steps=el('ol','','steps');for(const role of plan.handoff)steps.append(el('li',role.replaceAll('-',' ')));$('workflow').append(steps);
 const details=el('div','','plan-details');details.append(el('p',`Research: ${plan.research_status.replaceAll('-',' ')}.`),el('p',`Languages: ${plan.languages.join(' + ')}.`),el('p','Source presence does not establish accuracy. Review factual claims before publication.'),el('code',plan.utm_query));$('workflow').append(details);$('export-plan').disabled=false;
}
function setBrief(b){$('topic').value=b.topic;$('market').value=b.market;$('audience').value=b.audience;$('channel').value=b.channel;$('source').value=b.sources?.[0]||'';showPlan(b);}
function updateReport(){
 try{report=data.campaigns.map(metrics);$('report-error').textContent='';$('export-report').disabled=false;
  report.forEach((row,i)=>{for(const key of ['ctr_percent','cpc_usd','cpl_usd'])$(`${i}-${key}`).textContent=row[key]===null?'—':row[key].toFixed(2)+(key==='ctr_percent'?'%':'');});
  const sum=data.campaigns.reduce((s,r)=>({spend:s.spend+r.spend,impressions:s.impressions+r.impressions,clicks:s.clicks+r.clicks,leads:s.leads+r.leads}),{spend:0,impressions:0,clicks:0,leads:0}),m=metrics(sum);$('totals').replaceChildren();
  for(const [label,value] of [['Demo spend',`$${sum.spend.toLocaleString('en-US')}`],['Demo leads',sum.leads],['Blended CPL',m.cpl_usd===null?'—':`$${m.cpl_usd.toFixed(2)}`]]){const box=el('div','');box.append(el('span',label),el('strong',String(value)));$('totals').append(box);}
 }catch(error){$('report-error').textContent=error.message;$('export-report').disabled=true;$('totals').replaceChildren();document.querySelectorAll('[data-metric]').forEach(e=>e.textContent='—');}
}
function drawReport(){
 $('campaigns').replaceChildren();data.campaigns.forEach((row,i)=>{const tr=el('tr',''),name=el('td','');name.append(el('strong',row.name),el('small',`${row.market} · ${row.audience} · ${row.platform}`));tr.append(name);
 for(const key of ['spend','impressions','clicks','leads']){const td=el('td',''),input=document.createElement('input');input.type='number';input.min=0;input.step=key==='spend'?'.01':'1';input.value=row[key];input.setAttribute('aria-label',`${row.name}: ${key}`);input.addEventListener('input',()=>{row[key]=input.value===''?NaN:Number(input.value);updateReport();});td.append(input);tr.append(td);}
 for(const key of ['ctr_percent','cpc_usd','cpl_usd']){const td=el('td','—');td.id=`${i}-${key}`;td.dataset.metric='true';tr.append(td);}$('campaigns').append(tr);});updateReport();
}
for(const selected of ['plan','report'])$(selected+'-tab').addEventListener('click',()=>{for(const name of ['plan','report']){$(name+'-tab').setAttribute('aria-pressed',String(name===selected));$(name+'-panel').hidden=name!==selected;}});
$('brief-form').addEventListener('submit',event=>{event.preventDefault();try{showPlan({id:'demo-custom-brief',topic:$('topic').value,market:$('market').value,audience:$('audience').value,channel:$('channel').value,sources:$('source').value?[$('source').value]:[]});$('notice').textContent='Workflow plan updated. Nothing has been published.';}catch(error){$('notice').textContent=error.message;}});
$('export-plan').addEventListener('click',()=>download(JSON.stringify(plan,null,2),'5square-meter-content-plan.json','application/json'));
$('export-report').addEventListener('click',()=>download(csv(report),'5square-meter-demo-report.csv','text/csv;charset=utf-8'));
try{const response=await fetch('demo.json');if(!response.ok)throw Error();data=await response.json();setBrief(data.briefs[0]);for(const brief of data.briefs){const b=el('button',brief.topic);b.type='button';b.addEventListener('click',()=>setBrief(brief));$('examples').append(b);}drawReport();$('notice').textContent='Fictional examples loaded. No account connections or publishing actions.';}catch{$('notice').textContent='Example data could not be loaded. Reload to try again.';$('build-plan').disabled=true;}
