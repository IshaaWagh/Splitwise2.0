"use client"

import { useState } from "react"
import CreateGroupModal from "./create-group-modal"

export default function CreateGroupButton({ label = "New Group" }: { label?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-white text-black font-medium px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
      >
        {label}
      </button>
      {open && <CreateGroupModal onClose={() => setOpen(false)} />}
    </>
  )
}