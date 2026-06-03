'use client'

import Link from 'next/link'
import { useTransition } from 'react'

type Props = {
  id: string
  titel: string
  deleteAction: (formData: FormData) => Promise<void>
}

export default function AdminInserateActions({ id, titel, deleteAction }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Inserat «${titel}» wirklich löschen?`)) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      await deleteAction(fd)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/inserate/${id}/bearbeiten`}
        className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
      >
        Bearbeiten
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {isPending ? '…' : 'Löschen'}
      </button>
    </div>
  )
}
