import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import * as React from "react"
import CreateFamily from "../components/forms/FamilyForm"

export default async function Create() {
  const { auth } = createClient()
  const user = await auth.getUser()
  if (!user) {
    return redirect("/login`")
  }

  return (
    <div>
      <h1>Create a new family</h1>
      <CreateFamily />
    </div>
  )
}
