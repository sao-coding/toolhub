'use client'
import React from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import {
  MediaCanPlayDetail,
  MediaCanPlayEvent,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  Poster,
} from '@vidstack/react'

import VideoLayout from './layouts/video-layout'

import '@vidstack/react/player/styles/base.css'

const Player = ({
  title,
  coverUrl,
  hlsUrl,
  vttUrl,
  className,
}: {
  title: string
  coverUrl: string
  hlsUrl: string
  vttUrl: string
  className?: string
}) => {
  const player = React.useRef<MediaPlayerInstance>(null)
  // useStore(MediaPlayerInstance, ref);
  // const { playing } = useStore(MediaPlayerInstance, player)
  // console.log({ hlsUrl, vttUrl })

  // React.useEffect(() => {
  //   console.log({ playing })
  // }, [playing])

  React.useEffect(() => {
    toast.loading('影片載入中...', { id: 'loading' })
  }, [])

  const onCanPlay = (
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent
  ) => {
    toast.success('影片載入完成', { id: 'loading' })
  }

  return (
    <>
      <MediaPlayer
        id="player"
        // className='relative aspect-video w-full overflow-hidden rounded-md bg-black font-sans text-white ring-media-focus data-[focus]:ring-4'
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-md bg-black font-sans text-white ring-media-focus data-[focus]:ring-4',
          className
        )}
        title={title}
        src={{
          src: hlsUrl,
          type: 'video/mpegurl',
        }}
        // crossOrigin
        playsInline
        // onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        ref={player}
      >
        {/* <div className="absolute h-full w-full">
          <div
            id="video-barrage"
            className="relative h-[calc(var(--player-height)-(40px+48px))]"
          />
        </div> */}
        <MediaProvider>
          <Poster
            className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
            src={coverUrl}
            alt={title}
          />
          {/* <Track
            src='https://media-files.vidstack.io/sprite-fight/chapters.vtt'
            kind='chapters'
            language='en-US'
            default
          /> */}
        </MediaProvider>
        <VideoLayout thumbnails={vttUrl} />
      </MediaPlayer>
    </>
  )
}

export default Player
