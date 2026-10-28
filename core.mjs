export function buildPlan(brief) {
 if(!brief.topic?.trim())throw Error('Enter a topic.');
 if(!['developer','broker'].includes(brief.audience))throw Error('Choose an audience.');
 if(!['Georgia','UAE'].includes(brief.market))throw Error('Choose a market.');
 const writer={linkedin:'linkedin-content',blog:'copywriter',facebook:'social-media',x:'social-media'}[brief.channel];
 if(!writer)throw Error('Choose a supported channel.');
 return {id:brief.id,topic:brief.topic.trim(),market:brief.market,audience:brief.audience,channel:brief.channel,handoff:['content-strategist','seo-researcher',writer,'human-review'],research_status:brief.sources?.length?'sources-supplied-review-required':'research-needed',publication_status:'draft',languages:brief.market==='Georgia'?['English','Georgian']:['English'],utm_query:new URLSearchParams({utm_source:brief.channel,utm_medium:'content',utm_campaign:brief.id,utm_content:brief.audience}).toString()};
}
export function metrics(row) {
 for(const key of ['spend','impressions','clicks','leads'])if(typeof row[key]!=='number'||!Number.isFinite(row[key])||row[key]<0)throw Error(`${key} must be a non-negative number.`);
 for(const key of ['impressions','clicks','leads'])if(!Number.isInteger(row[key]))throw Error(`${key} must be a whole number.`);
 if(row.clicks>row.impressions)throw Error('Clicks cannot exceed impressions in this demo.');
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 return {...row,ctr_percent:row.impressions?round(row.clicks/row.impressions*100):null,cpc_usd:row.clicks?round(row.spend/row.clicks):null,cpl_usd:row.leads?round(row.spend/row.leads):null};
}
export function csv(rows){
 const fields=['name','market','audience','platform','spend','impressions','clicks','leads','ctr_percent','cpc_usd','cpl_usd'];
 const escape=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 return [fields.join(','),...rows.map(r=>fields.map(f=>escape(r[f])).join(','))].join('\r\n');
}
