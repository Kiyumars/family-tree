import { getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { fetchTreeData } from "../../actions"
import Members from "../components/Members"

export default async function TreePage({ params }: { params: { id: number } }) {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  return (
    <Suspense>
      <Tree id={params.id} />
    </Suspense>
  )
}

async function Tree({ id }: { id: number }) {
  const { membersRes, relationshipsRes } =
    await fetchTreeData(id)

  return (
    <Members
      familyId={id}
      familyMembers={membersRes.data}
      relationships={relationshipsRes.data}
    />
  )
}
