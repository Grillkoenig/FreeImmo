'use client'

import { useState, useTransition } from 'react'
import { deleteInserat } from '@/app/actions'

type Props = {
  inseratId: string
  titel: string
}

export default function DeleteButton({ inseratId, titel }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', inseratId)
      await deleteInserat(fd)
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
        <span className="text-xs text-red-700 font-medium whitespace-nowrap">Wirklich löschen?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded transition-colors disabled:opacity-60"
        >
          {isPending ? '…' : 'Ja'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-xs font-medium text-gray-600 hover:text-gray-900 px-1"
        >
          Nein
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`«${titel}» löschen`}
      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      Löschen
    </button>
  )
}
