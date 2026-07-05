// Crop the round badge out of the wide logo and export square favicons/icons.
// Run: node scripts/make-favicon.mjs
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const src = readFileSync('public/assets/logo.png') // 1536x1024, badge in upper-centre
const BADGE = { left: 448, top: 65, width: 640, height: 640 }

// Favicon (transparent corners ok) — Next serves this at /icon.png
await sharp(src).extract(BADGE).resize(256, 256).png().toFile('src/app/icon.png')
// Apple touch icon — flattened on white so it looks clean on iOS
await sharp(src).extract(BADGE).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile('src/app/apple-icon.png')
// Square logo for structured data / social cards
await sharp(src).extract(BADGE).resize(512, 512).flatten({ background: '#ffffff' }).png().toFile('public/assets/logo-square.png')

console.log('Generated: src/app/icon.png (256), src/app/apple-icon.png (180), public/assets/logo-square.png (512)')
