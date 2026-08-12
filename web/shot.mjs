import { chromium } from '@playwright/test'
const pages = [
  ['home', 'http://localhost:3000/'],
  ['about-ocd', 'http://localhost:3000/about-ocd'],
  ['blog', 'http://localhost:3000/blog'],
  ['post', 'http://localhost:3000/blog/yanns-ocd-story'],
  ['about-orchard', 'http://localhost:3000/about-orchard'],
  ['participate-research', 'http://localhost:3000/participate-research'],
]
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${m.location().url}: ${m.text()}`) })
page.on('pageerror', (e) => errors.push(String(e)))
for (const [name, url] of pages) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `/tmp/shots/${name}.png`, fullPage: true })
  console.log('shot', name)
}
console.log('console errors:', errors.length)
errors.slice(0, 10).forEach((e) => console.log(' -', e))
await browser.close()
