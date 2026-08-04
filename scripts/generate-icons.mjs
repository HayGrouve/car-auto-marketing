import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const logoPath = path.resolve('public/logo.png')
const publicDir = path.resolve('public')

async function toSquareIcon(size) {
  return sharp(logoPath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

await writeFile(path.join(publicDir, 'logo512.png'), await toSquareIcon(512))
await writeFile(path.join(publicDir, 'logo192.png'), await toSquareIcon(192))
await writeFile(path.join(publicDir, 'favicon.ico'), await toSquareIcon(32))

console.log('Generated favicon.ico, logo192.png, logo512.png from logo.png')
