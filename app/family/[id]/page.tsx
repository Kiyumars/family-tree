import { getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import * as React from "react"

export default async function Tree() {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  return (
    <div>
      <h1>Here is one family</h1>
    </div>
  )
}
