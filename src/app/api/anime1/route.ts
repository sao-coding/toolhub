import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const GET = async (_req: NextRequest) => {
  const BASE_URL = 'https://anime1.in'
  const PAGE_URL = `${BASE_URL}/2025-ban-ben-ri-chang/`

  try {
    // Step 1: 取得主頁 HTML
    const res = await fetch(PAGE_URL)
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch main page' },
        { status: 500 }
      )
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // Step 2: 找出所有 iframe
    const iframeElements = $(
      'main#main.site-main[role="main"] iframe'
    ).toArray()

    // Step 3: 對每個 iframe 執行影片網址擷取
    const videoUrlPromises = iframeElements.map(async (el) => {
      const src = $(el).attr('src')
      if (!src) return []

      const fullIframeUrl = `${BASE_URL}${src}`
      try {
        const res2 = await fetch(fullIframeUrl)
        if (!res2.ok) {
          console.warn(
            `Failed to fetch iframe src: ${fullIframeUrl} - ${res2.status}`
          )
          return []
        }

        const html2 = await res2.text()
        const $$ = cheerio.load(html2)

        const urls: string[] = []
        $$('source[type="application/x-mpegURL"]').each((_, sourceEl) => {
          const videoSrc = $$(sourceEl).attr('src')
          if (videoSrc) urls.push(videoSrc)
        })

        return urls
      } catch (err) {
        console.error(`Error processing iframe: ${fullIframeUrl}`, err)
        return []
      }
    })

    // Step 4: 等待所有 iframe 結果完成
    const nestedUrls = await Promise.all(videoUrlPromises)
    const videoUrls = nestedUrls.flat()

    // Step 5: 回傳影片網址
    return NextResponse.json({ videoUrls })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
