import {readFile,writeFile} from 'node:fs/promises';
import {githubProfile} from '../src/data.mjs';

export function parseCalendar(html){
 const total=Number(html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions/)?.[1]?.replaceAll(',',''));
 const tips=new Map([...html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)].map(m=>[m[1],Number(m[2].match(/^([\d,]+) contributions?/)?.[1]?.replaceAll(',','')||0)]));
 const days=[...html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="([0-4])"[^>]*>/g)].map(m=>({date:m[1],level:Number(m[3]),count:tips.get(m[2])??0})).sort((a,b)=>a.date.localeCompare(b.date));
 if(!Number.isFinite(total)||days.length<350)throw new Error('GitHub calendar unavailable');
 return {total,days};
}

async function get(url){const r=await fetch(url,{headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(12000)});if(!r.ok)throw new Error('GitHub returned '+r.status);return r;}
export async function refreshGithubActivity(output='dist/public/github-activity.json'){
 try{
  const [calendar,profile,...repositories]=await Promise.all([
   get(`https://github.com/users/${githubProfile.username}/contributions`).then(r=>r.text()).then(parseCalendar),
   get(`https://api.github.com/users/${githubProfile.username}`).then(r=>r.json()),
   ...githubProfile.repositories.map(async repo=>{const rows=await (await get(`https://api.github.com/repos/${githubProfile.username}/${repo.name}/commits?author=${githubProfile.username}&per_page=4`)).json();return rows.map(row=>({sha:row.sha,url:`https://github.com/${githubProfile.username}/${repo.name}/commit/${row.sha}`,project:repo.title,date:row.commit.author.date}));})
  ]);
  const snapshot={username:githubProfile.username,updatedAt:new Date().toISOString(),publicRepos:profile.public_repos,...calendar,commits:repositories.flat().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6)};
  await writeFile(output,JSON.stringify(snapshot));console.log('GitHub activity refreshed from public sources');return snapshot;
 }catch(error){
  const fallback=await readFile('public/github-activity.json','utf8');await writeFile(output,fallback);console.log('Using saved GitHub activity snapshot: '+error.message);return JSON.parse(fallback);
 }
}
