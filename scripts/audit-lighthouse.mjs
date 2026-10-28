import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const folder=process.env.AUDIT_DIR || 'lighthouse-results';
await mkdir(folder,{recursive:true});
const records=[];
for(const profile of ['mobile','desktop']) {
 for(let run=1;run<=3;run++) {
  const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox']});
  let timer;
  try {
   const desktopCfg = profile === 'desktop' ? {formFactor:'desktop',throttling:{rttMs:40,throughputKbps:10240,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0,cpuSlowdownMultiplier:1},screenEmulation:{mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false},emulatedUserAgent:''} : {};
   const result=await Promise.race([
    lighthouse('http://127.0.0.1:4173/',{port:chrome.port,output:'json',logLevel:'error',maxWaitForLoad:45000,maxWaitForFcp:30000,onlyCategories:['performance','accessibility','best-practices','seo'],...desktopCfg}),
    new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`${profile}-${run} exceeded 120 seconds`)),120000);}),
   ]);
   const lhr=result.lhr;
   await writeFile(`${folder}/${profile}-${run}.json`,JSON.stringify(lhr,null,2));
   const record={profile,run,version:lhr.lighthouseVersion,fetchTime:lhr.fetchTime,settings:lhr.configSettings,scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),LCP:lhr.audits['largest-contentful-paint'].numericValue,CLS:lhr.audits['cumulative-layout-shift'].numericValue,failures:Object.entries(lhr.audits).filter(([,audit])=>audit.score!==null&&audit.score<1).map(([id,audit])=>({id,title:audit.title,score:audit.score}))};
   records.push(record);
   await writeFile(`${folder}/summary.json`,JSON.stringify(records,null,2));
   console.log(JSON.stringify({profile,run,scores:record.scores,LCP:record.LCP,CLS:record.CLS}));
  } finally {clearTimeout(timer);await chrome.kill();}
 }
}
