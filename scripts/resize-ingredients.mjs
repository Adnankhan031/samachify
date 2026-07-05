// One-off: shrink the huge ingredient photos (shown at ~72px) to tiny,
// web-friendly squares. Overwrites in place — run with: node scripts/resize-ingredients.mjs
import sharp from 'sharp'
import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'public/assets/Ingredients'
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))

let before = 0, after = 0
for (const f of files) {
  const p = join(dir, f)
  const sizeBefore = statSync(p).size
  before += sizeBefore
  try {
    const input = readFileSync(p) // read fully first — avoids sharp file-handle issues on huge files
    const buf = await sharp(input, { failOn: 'none' })
      .resize(256, 256, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 78 })
      .toBuffer()
    writeFileSync(p, buf)
    after += buf.length
    console.log(`${f.padEnd(36)} ${(sizeBefore / 1024).toFixed(0).padStart(6)} KB -> ${(buf.length / 1024).toFixed(0).padStart(4)} KB`)
  } catch (e) {
    console.error(`FAILED ${f}:`, e.message)
  }
}
console.log(`\nTotal: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB`)
