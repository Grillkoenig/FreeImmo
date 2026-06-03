'use client'

import { useTransition } from 'react'

type Props = {
  id: string
  email: string
  role: string
  inserateCount: number
  setRoleAction: (formData: FormData) => Promise<void>
  deleteAction: (formData: FormData) => Promise<void>
}

export default function AdminUserActions({ id, email, role, inserateCount, setRoleAction, deleteAction }: Props) {
  const [rolePending, startRoleTransition] = useTransition()
  const [deletePending, startDeleteTransition] = useTransition()

  function handleRoleToggle() {
    startRoleTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      fd.set('role', role === 'admin' ? 'user' : 'admin')
      await setRoleAction(fd)
    })
  }

  function handleDelete() {
    if (!confirm(`Benutzer «${email}» und alle ${inserateCount} Inserate wirklich löschen?`)) return
    startDeleteTransition(async () => {
      const fd = new FormData()
      fd.set('id', id)
      await deleteAction(fd)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRoleToggle}
        disabled={rolePending}
        className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap disabled:opacity-50"
      >
        {rolePending ? '…' : role === 'admin' ? '→ User' : '→ Admin'}
      </button>
      <button
        onClick={handleDelete}
        disabled={deletePending}
        className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {deletePending ? '…' : 'Löschen'}
      </button>
    </div>
  )
}
