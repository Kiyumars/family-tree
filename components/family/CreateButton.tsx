import * as React from "react"

interface Props {
  onClick: () => void
}

export default function CreateButton({ onClick }: Props) {
  return <button onClick={onClick}>Create Family</button>
}
