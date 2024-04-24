import { getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Trees() {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  return (
    <div>
      <h1>Here are all the families</h1>
    </div>
  )
}
