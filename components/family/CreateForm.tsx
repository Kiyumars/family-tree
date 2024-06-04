"use client"

import * as React from "react"
import ModalWrapper from "../modal/ModalWrapper"
import { useRouter } from "next/navigation"
import { createTree } from "@/app/actions"

interface Props {
  onClose: () => void
}

export default function Create({ onClose }: Props) {
  const { push } = useRouter()
  return (
    <ModalWrapper>
      <form
        action={async (fd) => {
          const id = await createTree(fd)
          onClose()
          push(`/tree/${id}`)
        }}
      >
        <FormContent />
      </form>
      <button onClick={onClose}>Cancel</button>
    </ModalWrapper>
  )
}

export function FormContent() {
  return (
    <div>
      <div>
        <label htmlFor="name">Name of family </label>
        <input type="text" name="name" id="name" required />
      </div>
      <div>
        <label htmlFor="description">Description on family </label>
        <input type="text" name="description" id="description" />
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </div>
  )
}
