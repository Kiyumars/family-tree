"use client"

import * as React from "react"
import CreateButton from "@/components/family/CreateButton"
import CreateForm from "@/components/family/CreateForm"

export default function Create() {
  const [isTriggered, setTriggerModal] = React.useState(false)
  return (
    <div>
      {isTriggered && <CreateForm onClose={() => setTriggerModal(false)} />}
      <CreateButton onClick={() => setTriggerModal(true)} />
    </div>
  )
}
