import {
  CastIcon,
  Maximize as FullscreenIcon,
  Minimize as FullscreenExitIcon,
  PauseIcon,
  PictureInPicture2 as PictureInPictureIcon,
  PictureInPictureIcon as PictureInPictureExitIcon,
  PlayIcon,
  SubtitlesIcon,
  Volume1 as VolumeLowIcon,
  Volume2 as VolumeHighIcon,
  VolumeX as MuteIcon,
} from 'lucide-react'
import {
  CaptionButton,
  FullscreenButton,
  GoogleCastButton,
  MuteButton,
  PIPButton,
  PlayButton,
  Tooltip,
  TooltipPlacement,
  useMediaState,
} from '@vidstack/react'

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement
}

export const buttonClass =
  'group ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4'

export const tooltipClass =
  'animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden'

export function Play({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState('paused')
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          {isPaused ? (
            <PlayIcon className="h-8 w-8" />
          ) : (
            <PauseIcon className="h-8 w-8" />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isPaused ? '播放' : '暂停'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function Mute({ tooltipPlacement }: MediaButtonProps) {
  const volume = useMediaState('volume'),
    isMuted = useMediaState('muted')
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={buttonClass}>
          {isMuted || volume == 0 ? (
            <MuteIcon className="h-8 w-8" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="h-8 w-8" />
          ) : (
            <VolumeHighIcon className="h-8 w-8" />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isMuted ? '取消静音' : '静音'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

// Google Cast
export function Cast({ tooltipPlacement }: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <GoogleCastButton className={buttonClass}>
          <CastIcon className="h-8 w-8" />
        </GoogleCastButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        Google Cast
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function PIP({ tooltipPlacement }: MediaButtonProps) {
  const isActive = useMediaState('pictureInPicture')
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={buttonClass}>
          {isActive ? (
            <PictureInPictureExitIcon className="h-8 w-8" />
          ) : (
            <PictureInPictureIcon className="h-8 w-8" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? '退出畫中畫' : '進入畫中畫'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function Fullscreen({ tooltipPlacement }: MediaButtonProps) {
  const isActive = useMediaState('fullscreen')
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={buttonClass}>
          {isActive ? (
            <FullscreenExitIcon className="h-8 w-8" />
          ) : (
            <FullscreenIcon className="h-8 w-8" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? '退出全螢幕' : '進入全螢幕'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
