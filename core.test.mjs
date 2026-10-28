import test from 'node:test';import assert from 'node:assert/strict';
import {buildPlan,metrics,csv} from './core.mjs';
test('plans route by channel and retain human review',()=>{const p=buildPlan({id:'demo',topic:'Inventory',market:'Georgia',audience:'broker',channel:'linkedin',sources:[]});assert.deepEqual(p.handoff.slice(-2),['linkedin-content','human-review']);assert.equal(p.publication_status,'draft');assert.equal(p.research_status,'research-needed');assert.deepEqual(p.languages,['English','Georgian']);});
test('sources are not marked verified',()=>assert.equal(buildPlan({id:'demo',topic:'Inventory',market:'UAE',audience:'developer',channel:'blog',sources:['https://example.com']}).research_status,'sources-supplied-review-required'));
test('metrics calculate correctly with undefined zero denominators',()=>{const p=metrics({spend:1200,impressions:60000,clicks:600,leads:30});assert.equal(p.ctr_percent,1);assert.equal(p.cpc_usd,2);assert.equal(p.cpl_usd,40);assert.equal(metrics({spend:5,impressions:0,clicks:0,leads:0}).cpl_usd,null);});
test('invalid counts and spend are rejected',()=>{for(const row of [{spend:-1,impressions:1,clicks:1,leads:0},{spend:1,impressions:1,clicks:2,leads:0},{spend:1,impressions:1,clicks:1,leads:.5}])assert.throws(()=>metrics(row));});
test('CSV neutralises formula cells',()=>assert.ok(csv([{name:'=SUM(1,2)'}]).includes("'=SUM")));
