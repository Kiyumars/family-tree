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
  const createButton = (
    <Link href="/tree/create">
      <button>Create a new family</button>
    </Link>
  )
  if (!tree || !tree.length) {
    return (
      <div>
        <h1>There are no families in the database</h1>
        {createButton}
      </div>
    )
  }
  return (
    <div>
      <h1>Here are all the family trees</h1>
      <ul>
        {tree.map((tree) => {
          return (
            <li key={`tree-${tree.id}`}>
              <Link href={`/tree/${tree.id}`}>{tree.name}</Link>
            </li>
          )
        })}
      </ul>
      {createButton}
    </div>
  )
}
