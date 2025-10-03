import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get('url')
  const referer = req.nextUrl.searchParams.get('referer')

  if (!url) {
    return new Response('URL parameter is required', { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        // 有些網站會檢查 Referer
        Referer: referer || new URL(url).origin,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    })

    if (!res.ok) {
      return new Response(`Failed to fetch: ${res.statusText}`, {
        status: res.status,
      })
    }

    const contentType = res.headers.get('content-type')

    // 如果是 m3u8 檔案
    if (
      contentType?.includes('application/vnd.apple.mpegurl') ||
      contentType?.includes('application/x-mpegurl') ||
      (contentType === 'application/octet-stream' && url.endsWith('.m3u8'))
    ) {
      let m3u8Text = await res.text()
      const baseUrl = new URL(url)

      const createProxyUrl = (path: string) => {
        const newUrl = new URL(path, baseUrl)
        const searchParams = new URLSearchParams({
          url: newUrl.href,
        })
        if (referer) {
          searchParams.set('referer', referer)
        }
        return `/api/anime/proxy?${searchParams.toString()}`
      }

      // 將 .ts 的路徑替換成我們的代理路徑
      m3u8Text = m3u8Text.replace(/^(.*\.ts)$/gm, (_, path) =>
        createProxyUrl(path)
      )
      // 將 .m3u8 的路徑也替換成我們的代理路徑 (處理多層 m3u8)
      m3u8Text = m3u8Text.replace(/^(.*\.m3u8)$/gm, (_, path) =>
        createProxyUrl(path)
      )
      // 將 #EXT-X-KEY 的 URI 替換成我們的代理路徑
      m3u8Text = m3u8Text.replace(
        /#EXT-X-KEY:METHOD=AES-128,URI="([^"]+)"/g,
        (_, keyUri) => {
          const proxiedKeyUrl = createProxyUrl(keyUri)
          return `#EXT-X-KEY:METHOD=AES-128,URI="${proxiedKeyUrl}"`
        }
      )

      return new Response(m3u8Text, {
        headers: {
          'Content-Type': contentType,
        },
      })
    }

    // 如果是 .ts 影片分段檔或其他檔案，直接回傳
    return new Response(res.body, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
