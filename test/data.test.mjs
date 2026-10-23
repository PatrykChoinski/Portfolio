import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, filterProjects, skills } from '../src/data.mjs';
import { generateCvHtml } from '../scripts/cv-template.mjs';
import { portfolioScreenshots, machines, portrait, technologyLogos, equipment, protocols, pipelineRuns } from '../src/data.mjs';
import { stat } from 'node:fs/promises';
import {sampleSignal} from '../src/scada-demo.mjs';
test('filters compose category and case-insensitive technology search',()=>{assert.equal(filterProjects('Automatyka','  Automatyczne testy  ').length,1);assert.equal(filterProjects('Automatyka','WebGL').length,0);assert.equal(filterProjects('Wszystkie','nieistniejąca').length,0);assert.equal(filterProjects().length,projects.length);});
test('every case study has an anonymous company and supporting evidence',()=>{assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);for(const p of projects){assert.match(p.sector,/^Firma z branży /);assert.ok(p.evidence&&p.challenge&&p.solution);assert.ok(p.tags.length);}});
test('CV includes every current project and technology',()=>{const cv=generateCvHtml();for(const p of projects){assert.ok(cv.includes(p.title));assert.ok(cv.includes(p.sector));}for(const s of skills)for(const technology of s.items)assert.ok(cv.includes(technology));});
test('public descriptions do not disclose customer names or local access data',()=>{const content=JSON.stringify({projects,skills})+generateCvHtml();assert.doesNotMatch(content,/SILSPEK|Promasz|ZEMAT|Induprogress|192\.168\.|password\s*[:=]|E:\\/i);});
test('all published media have local files and source attribution',async()=>{for(const asset of [portrait,...machines,...technologyLogos,...equipment,...protocols]){assert.ok(asset.source.startsWith('https://'));assert.ok(asset.src.startsWith('./public/'));assert.ok((await stat(asset.src)).size>100);}for(const asset of portfolioScreenshots){assert.ok(asset.alt&&asset.caption);assert.ok((await stat(asset.src)).size>100);}});
test('SCADA demo generates bounded finite signals without using operational data',()=>{for(const t of [0,12,45,78,90])for(const batch of [1,2])for(const key of ['mixer','speed','current','stamp','drain','inlet'])assert.ok(Number.isFinite(sampleSignal(key,t,batch)));assert.equal(sampleSignal('inlet',0),0);assert.equal(sampleSignal('drain',90),100);assert.notEqual(sampleSignal('mixer',45,1),sampleSignal('mixer',45,2));});

test('pipeline replay preserves actual outcomes and skips deployment after compile failure',()=>{const failure=pipelineRuns.find(r=>r.result==='failure');assert.equal(failure.steps[1].result,'failure');assert.equal(failure.steps[2].result,'skipped');assert.equal(failure.steps[3].result,'skipped');for(const run of pipelineRuns){assert.match(run.url,/github.com\/PatrykChoinski\/Codesys-CI-CD\/actions\/runs\/\d+/);for(const step of run.steps)assert.ok(Number.isFinite(step.seconds)&&step.seconds>=0);}});
