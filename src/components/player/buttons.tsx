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
import { CheckIcon, OdometerIcon } from '@vidstack/react/icons'
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
  Menu,
  usePlaybackRateOptions,
} from '@vidstack/react'

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement
}

export const buttonClass =
  'group ring-media-focus relative inline-flex size-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4'

export const tooltipClass =
  'animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden'

export function Play({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState('paused')
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          {isPaused ? (
            <PlayIcon className="size-8" />
          ) : (
            <PauseIcon className="size-8" />
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
            <MuteIcon className="size-8" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="size-8" />
          ) : (
            <VolumeHighIcon className="size-8" />
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
          <CastIcon className="size-8" />
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
            <PictureInPictureExitIcon className="size-8" />
          ) : (
            <PictureInPictureIcon className="size-8" />
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
            <FullscreenExitIcon className="size-8" />
          ) : (
            <FullscreenIcon className="size-8" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? '退出全螢幕' : '進入全螢幕'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

// 播放速度選單 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x, 4x, 5x
export function Speed({ tooltipPlacement }: MediaButtonProps) {
  const options = usePlaybackRateOptions(),
    hint = options.selectedValue === '1' ? '正常' : options.selectedValue + 'x'

  return (
    <Menu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass} aria-label="Speed">
            <OdometerIcon className="size-8" />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
          {hint === '正常' ? '正常速度' : `${options.selectedValue}x`}
        </Tooltip.Content>
      </Tooltip.Root>

      <Menu.Items className="media-menu" placement="top" offset={0}>
        <Menu.RadioGroup
          className="flex flex-col rounded-md bg-black/80 p-2 w-24"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="media-radio hover:bg-white/10 flex items-center rounded-md"
              value={value}
              onSelect={select}
              key={value}
            >
              <span className="media-radio-label mr-auto">{label}</span>
              {options.selectedValue === value && (
                <CheckIcon className="media-radio-icon size-4" />
              )}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Items>
    </Menu.Root>
  )
}
