import { test, expect } from '@playwright/test';

for (const width of [320,375,390,768,1024,1280,1440,1920]) {
 test(`responsive layout ${width}`, async ({page}) => {
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const id of ['about','seasons','suites','stories','journal','places']) await expect(page.locator(`#${id}`)).toBeVisible();
  const button=page.getByRole('button',{name:'Discover'});
  await button.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.getByRole('dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
 });
}

test('keyboard modal, focus wrapping, Escape, Space and anchor focus', async ({page}) => {
 await page.goto('/');
 const trigger=page.getByRole('button',{name:'Discover'});
 await trigger.focus(); await page.keyboard.press('Enter');
 const close=page.getByRole('button',{name:'× Close'});
 await expect(close).toBeFocused();
 await page.keyboard.press('Shift+Tab');
 await expect(page.getByRole('dialog').getByRole('link').last()).toBeFocused();
 await page.keyboard.press('Tab'); await expect(close).toBeFocused();
 await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
 await page.keyboard.press('Space'); await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('dialog').getByRole('link',{name:'A place to stay'}).click();
 await expect(page.getByRole('dialog')).not.toBeVisible();
 await expect(page.locator('#suites')).toBeFocused();
 await expect(page).toHaveURL(/#suites$/);
 expect(await page.locator('body').evaluate(e=>getComputedStyle(e).overflow)).not.toBe('hidden');
});

test('without JavaScript static content and footer links work',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/');
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 const footer=page.getByRole('navigation',{name:'Footer navigation'});
 await footer.getByRole('link',{name:'A place to stay'}).click();
 await expect(page).toHaveURL(/#suites$/);
 await expect(page.locator('#suites')).toBeInViewport();
 expect(await page.locator('#about').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
 await context.close();
});

test('reduced motion has no reveal or menu animation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.locator('#seasons').scrollIntoViewIfNeeded();
 await page.getByRole('button',{name:'Discover'}).click();
 expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
 expect(await page.locator('html').evaluate(e=>getComputedStyle(e).scrollBehavior)).toBe('auto');
});

test('failed images and fonts preserve usable content',async({page})=>{
 await page.route('**/images/**',route=>route.abort());
 await page.route('**/fonts/**',route=>route.abort());
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await page.getByRole('button',{name:'Discover'}).click();
 await page.getByRole('dialog').getByRole('link',{name:'The journal'}).click();
 await expect(page.locator('#journal')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('delayed media does not gate content or navigation',async({page})=>{
 await page.route(/\.(avif|webp|ttf|woff2)$/,async route=>{await new Promise(resolve=>setTimeout(resolve,700));await route.continue();});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await page.getByRole('button',{name:'Discover'}).click();await expect(page.getByRole('dialog')).toBeVisible();
});

test('services retained, no runtime errors and all images load',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';} await Promise.all([...document.images].map(img=>img.decode()));});
 expect(errors).toEqual([]);
 await page.goto('/services/');await expect(page.getByRole('heading',{name:'Our services'})).toBeVisible();
 await page.getByRole('button',{name:'Discover'}).click();
 await page.getByRole('dialog').getByRole('link',{name:'The villa'}).click();
 await expect(page).toHaveURL(/\/#about$/);
 await expect(page.locator('#about')).toBeVisible();
});

for(const [width,height,name] of [[1440,900,'desktop'],[390,844,'mobile'],[768,1024,'tablet']]) {
 test(`visual baseline ${name}`,async({page},info)=>{
  test.skip(info.project.name!=='chromium','Visual baselines recorded in Chromium; behavior checked in all engines.');
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode()));});
  await expect(page).toHaveScreenshot(`${name}-full.png`,{fullPage:true,animations:'disabled'});
 });
}


