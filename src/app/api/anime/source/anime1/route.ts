import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

type Episode = {
  title: string
  m3u8Url: string
}

// Helper function to fetch and parse a page
async function scrapePage(
  pageUrl: string,
  baseUrl: string
): Promise<Episode[]> {
  try {
    const res = await fetch(pageUrl, {
      headers: {
        Referer: baseUrl,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    })
    if (!res.ok) {
      console.warn(`Failed to fetch page: ${pageUrl} - ${res.status}`)
      return []
    }
    const html = await res.text()
    const $ = cheerio.load(html)

    const articles = $('main#main article').toArray()

    const episodePromises = articles.map(
      async (article): Promise<Episode | null> => {
        const title = $(article).find('.entry-title a').text()
        const iframeSrc = $(article).find('iframe').attr('src')

        if (!iframeSrc) {
          return null
        }

        const fullIframeUrl = iframeSrc.startsWith('http')
          ? iframeSrc
          : `${baseUrl}${iframeSrc}`
        try {
          const res2 = await fetch(fullIframeUrl, {
            headers: {
              Referer: baseUrl,
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            },
          })
          if (!res2.ok) {
            return null
          }
          const html2 = await res2.text()
          const $$ = cheerio.load(html2)
          const m3u8Url = $$('source[type="application/x-mpegURL"]').attr('src')

          if (m3u8Url) {
            return { title, m3u8Url }
          }
          return null
        } catch (err) {
          console.error(`Error processing iframe: ${fullIframeUrl}`, err)
          return null
        }
      }
    )

    const episodes = await Promise.all(episodePromises)
    return episodes.filter((e): e is Episode => e !== null) // Remove nulls
  } catch (error) {
    console.error(`Failed to scrape page: ${pageUrl}`, error)
    return []
  }
}

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  let baseUrlObj: URL
  try {
    baseUrlObj = new URL(url)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }
  const BASE_URL = `${baseUrlObj.protocol}//${baseUrlObj.hostname}`

  try {
    const page1Url = url
    const page2Url = `${url.replace(/\/$/, '')}/page/2`

    const [episodes1, episodes2] = await Promise.all([
      scrapePage(page1Url, BASE_URL),
      scrapePage(page2Url, BASE_URL),
    ])

    const allEpisodes = [...episodes1, ...episodes2]

    return NextResponse.json({ episodes: allEpisodes })
  } catch (error) {
    console.error('Unexpected error in anime1 scraper:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
