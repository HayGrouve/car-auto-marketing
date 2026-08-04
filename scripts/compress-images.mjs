import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imagesDir = path.resolve('public/images')

async function compressPng(inputPath, buffer) {
  const output = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer()
  await writeFile(inputPath, output)
  return output.length
}

async function compressJpg(inputPath, buffer) {
  const output = await sharp(buffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  await writeFile(inputPath, output)
  return output.length
}

const files = await readdir(imagesDir)

for (const file of files) {
  const inputPath = path.join(imagesDir, file)
  const buffer = await readFile(inputPath)

  if (file.endsWith('.png')) {
    const size = await compressPng(inputPath, buffer)
    console.log(`compressed ${file}: ${buffer.length} → ${size} bytes`)
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    const size = await compressJpg(inputPath, buffer)
    console.log(`compressed ${file}: ${buffer.length} → ${size} bytes`)
  }
}
