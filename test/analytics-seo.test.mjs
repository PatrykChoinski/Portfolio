import test from 'node:test';
import assert from 'node:assert/strict';
import {measurementEnabled,safeCampaign} from '../src/analytics.mjs';
import {site} from '../src/data.mjs';
import {seoHead,sitemap,privacyPage,reportsPage} from '../scripts/site-template.mjs';
test('analytics accepts only configured production origin and portfolio path',()=>{
 assert.equal(measurementEnabled(site,new URL(site.url)),true);
 assert.equal(measurementEnabled(site,new URL('https://patrykchoinski.eu/')),true);
 assert.equal(measurementEnabled(site,new URL('https://patrykchoinski.eu.evil.example/')),false);
 for(const url of ['http://127.0.0.1:4173/','https://example.com/Portfolio/','https://patrykchoinski.github.io/Other/'])assert.equal(measurementEnabled(site,new URL(url)),false);
 assert.equal(measurementEnabled({...site,measurementId:''},new URL(site.url)),false);
});
test('campaign mapping omits unapproved fields and contact-like values',()=>{
 assert.deepEqual(safeCampaign('?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio&email=private@example.com'),{campaign_source:'linkedin',campaign_medium:'social',campaign_name:'portfolio'});
 assert.deepEqual(safeCampaign('?utm_source=private@example.com&utm_term=private'),{});
});
test('SEO metadata describes the actual person and canonical repository URL',()=>{
 const head=seoHead(),schema=JSON.parse(head.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema['@type'],'ProfilePage');assert.equal(schema.mainEntity.name,'Patryk Choiński');assert.equal(schema.url,site.url);
 assert.match(head,/rel="canonical"/);assert.match(head,/og:image/);assert.ok(sitemap().includes(`<loc>${site.url}</loc>`));
 assert.match(privacyPage(),/noindex,follow/);assert.match(reportsPage(),/Search Console/);assert.match(reportsPage(),/po zalogowaniu/);
});
