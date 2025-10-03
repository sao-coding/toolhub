'use client'
import { useRouter } from 'next/navigation'
import { FormEventHandler } from 'react'

export default function Home() {
  const router = useRouter()
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const url = formData.get('url') as string
    if (url) {
      router.push(`/video?url=${encodeURIComponent(url)}`)
    }
  }
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="mb-8 text-4xl font-bold">Anime1 Player</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex items-center rounded-lg border-2 border-gray-600 bg-gray-800 p-2">
          <input
            type="text"
            name="url"
            placeholder="https://anime1.in/..."
            className="w-full appearance-none bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none"
          >
            Play
          </button>
        </div>
      </form>
    </div>
  )
}
