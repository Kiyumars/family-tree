import { createClient, getSSRUser } from "@/utils/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function Trees() {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }

  return (
    <Suspense>
      <Content />
    </Suspense>
  )
}

async function Content() {
  const client = createClient()
  const { data: tree } = await client.from("trees").select()
  if (!tree || !tree.length) {
    return (
      <div>
        <h1>There are no families in the database</h1>
      </div>
    )
  }
  return (
    <div>
      <h1>Here are all the family trees</h1>
      <ul>
        {tree.map((tree) => {
          return (
            <li>
              <Link href={`/tree/${tree.id}`}>{tree.name}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
