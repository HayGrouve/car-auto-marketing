import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const env = process.env.VERCEL_ENV
  if (env && env !== 'production') {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
