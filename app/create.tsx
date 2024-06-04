"use client"

import * as React from "react"
import CreateForm from "@/components/family/CreateForm"

export default function Create() {
  const [isTriggered, setTriggerModal] = React.useState(false)
  return (
    <div>
      {isTriggered && <CreateForm onClose={() => setTriggerModal(false)} />}
      <button onClick={() => setTriggerModal(true)}>Create Family</button>
    </div>
  )
}
