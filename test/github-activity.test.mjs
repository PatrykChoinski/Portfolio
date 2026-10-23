import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseCalendar} from '../scripts/github-activity.mjs';
import {readFile} from 'node:fs/promises';
test('GitHub snapshot contains sourced counts and only approved public commit metadata',async()=>{
 const data=JSON.parse(await readFile('public/github-activity.json','utf8'));
 assert.ok(data.days.length>=350);assert.ok(data.total>0);assert.ok(data.publicRepos>0);
 for(const d of data.days){assert.match(d.date,/^\d{4}-\d{2}-\d{2}$/);assert.ok(d.level>=0&&d.level<=4);assert.ok(Number.isInteger(d.count)&&d.count>=0);}
 for(const c of data.commits){assert.deepEqual(Object.keys(c).sort(),['date','project','sha','url']);assert.match(c.url,/^https:\/\/github.com\/PatrykChoinski\//);assert.match(c.sha,/^[a-f0-9]{40}$/);}
 assert.throws(()=>parseCalendar('<html>unavailable</html>'));
});
