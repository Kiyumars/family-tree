import { createClient, getSSRUser } from "@/utils/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Trees() {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  const client = createClient()
  const { data: families } = await client.from("families").select()
  if (!families || !families.length) {
    return (
      <div>
        <h1>There are no families in the database</h1>
      </div>
    )
  }
  return (
    <div>
      <h1>Here are all the families</h1>
      <ul>
        {families.map((family) => {
          return (
            <li>
              <Link href={`/family/${family.id}`}>{family.name}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
