"use client"

import { createTree } from "@/app/actions"
import { useRouter } from "next/navigation"

export default function CreateFamily() {
  const { push } = useRouter()
  return (
    <form
      action={async (fd: FormData) => {
        const id = await createTree(fd)
        push(`/tree/${id}`)
      }}
    >
      <Content />
    </form>
  )
}

export function Content() {
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
