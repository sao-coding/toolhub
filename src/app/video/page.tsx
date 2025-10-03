'use client'
import '@vidstack/react/player/styles/base.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import VideoLayout from '@/components/player/layouts/video-layout'
import Player from '@/components/player/player'

type Episode = {
  title: string
  m3u8Url: string
}

const VideoPlayer = () => {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (url) {
      setLoading(true)
      fetch(`/api/anime/source/anime1?url=${encodeURIComponent(url)}`)
        .then((res) => res.json())
        .then((data) => {
          setEpisodes(data.episodes || [])
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch episodes', err)
          setLoading(false)
        })
    }
  }, [url])

  const handleEpisodeClick = (m3u8Url: string) => {
    if (!url) return
    const proxiedUrl = `/api/anime/proxy?url=${encodeURIComponent(
      m3u8Url
    )}&referer=${encodeURIComponent(url)}`
    setCurrentSrc(proxiedUrl)
  }

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {currentSrc ? (
          <Player
            coverUrl=""
            // title={`${videoMetaData.title} - 第${episode}集`}
            title="Video Player"
            hlsUrl={currentSrc}
            vttUrl=""
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black text-white">
            <p>請從右側列表選擇一集播放</p>
          </div>
        )}
      </div>
      <div className="w-80 flex-shrink-0 overflow-y-auto bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold">播放列表</h2>
        {loading ? (
          <p>載入中...</p>
        ) : (
          <ul>
            {episodes.map((ep, index) => (
              <li
                key={index}
                onClick={() => handleEpisodeClick(ep.m3u8Url)}
                className="cursor-pointer rounded p-2 hover:bg-gray-700"
              >
                {ep.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const VideoPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <VideoPlayer />
  </Suspense>
)

export default VideoPage
