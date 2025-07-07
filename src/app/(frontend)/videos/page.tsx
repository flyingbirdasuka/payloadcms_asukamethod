'use client'

import { useEffect, useState } from 'react'
import { getClientSideURL } from '@/utilities/getURL'

type Video = {
  id: string
  youtubeURL: string
  title: string
  tags: { id: string; name: string }[]
}

export default function VideoGalleryPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
        console.log('triggered')
      const res = await fetch(`${getClientSideURL()}/api/videos?depth=1`)
      const json = await res.json()
      console.log('test',json.docs)
      setVideos(json.docs)
    }

    fetchVideos()
  }, [])

  const filteredVideos = selectedTag
    ? videos.filter((video) => video.tags?.some((tag) => tag.id === selectedTag))
    : videos

  const allTags = Array.from(
    new Map(
      videos
        .flatMap((video) => video.tags || [])
        .map((tag) => [tag.id, tag])
    ).values()
  )

  return (
    <div className="p-6">
      <div className="mb-4 space-x-2">
        <button onClick={() => setSelectedTag(null)} className="px-4 py-1 rounded bg-gray-200">
          All
        </button>
        {allTags.map((tag) => (
        <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            className={`px-4 py-1 rounded ${
            selectedTag === tag.id ? 'bg-purple-500 text-white' : 'bg-gray-100'
            }`}
        >
            {tag.name}
        </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div key={video.id} className="aspect-video">
            <iframe
              className="w-full h-full rounded shadow"
              src={`https://www.youtube.com/embed/${video.youtubeURL}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
            <p className="mt-2 text-sm">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
