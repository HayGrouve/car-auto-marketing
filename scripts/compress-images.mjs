import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imagesDir = path.resolve('public/images')
const files = await readdir(imagesDir)
const pngs = files.filter((f) => f.endsWith('.png'))

for (const file of pngs) {
  const input = path.join(imagesDir, file)
  const buffer = await readFile(input)
  const output = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer()
  await writeFile(input, output)
  console.log(`compressed ${file}: ${buffer.length} → ${output.length} bytes`)
}
