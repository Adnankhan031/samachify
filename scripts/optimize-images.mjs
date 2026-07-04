// One-off image pipeline: takes the raw client photos from /Photos,
// resizes + converts to WebP, and writes them into /public/assets with clean names.
// Run with: node scripts/optimize-images.mjs
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const SRC = path.join(root, 'Photos')
const OUT = path.join(root, 'public', 'assets')

// [ source file, output name (no ext), target width, role ]
const jobs = [
  // Hero slider — wide, full-bleed lifestyle shots
  ['ChatGPT Image Jun 26, 2026, 03_26_35 PM (1) (1).png', 'hero-all-products', 1920, 'hero'],
  ['ChatGPT Image Jun 26, 2026, 03_26_45 PM (1) (1).png', 'hero-all-products-2', 1920, 'hero'],
  ['ChatGPT Image Jun 26, 2026, 02_30_11 PM (1).png', 'hero-sambar-meal', 1920, 'hero'],
  ['ChatGPT Image Jun 26, 2026, 02_31_51 PM (1).png', 'hero-kara-meal', 1920, 'hero'],
  ['ChatGPT Image Jun 26, 2026, 02_34_27 PM (2).png', 'hero-chutney-breakfast', 1920, 'hero'],

  // Product cards / detail — one clean shot each
  ['Jun 30, 2026, 12_19_05 PM (1).png', 'product-sambar', 1100, 'product'],
  ['ChatGPT Image Jun 30, 2026, 01_54_39 PM (1).png', 'product-kara-kuzhambu', 1100, 'product'],
  ['ChatGPT Image Jun 26, 2026, 02_57_55 PM (1) (1).png', 'product-coconut-chutney', 1100, 'product'],
  ['ChatGPT Image Jun 30, 2026, 12_26_06 PM (1).png', 'product-tomato-chutney', 1100, 'product'],

  // Gallery secondary
  ['DSC_0033 - Copy.JPG', 'gallery-tomato-chutney', 1100, 'gallery'],
]

const run = async () => {
  for (const [file, name, width, role] of jobs) {
    const inPath = path.join(SRC, file)
    const outPath = path.join(OUT, `${name}.webp`)
    try {
      const info = await sharp(inPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath)
      console.log(`✓ ${role.padEnd(8)} ${name}.webp  ${(info.size / 1024).toFixed(0)} KB  (${info.width}x${info.height})`)
    } catch (err) {
      console.error(`✗ FAILED ${file}:`, err.message)
    }
  }
}

run()
