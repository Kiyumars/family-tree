import { fetchFamilyTree } from "@/app/actions"
import { createClient, getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Members from "../components/Members"

export default async function TreePage({ params }: { params: { id: number } }) {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  const client = createClient()
  const { familyMembers: nodes, familyRelationships: edges } = await fetchFamilyTree(
    client,
    params.id
  )

  if (
    !nodes ||
    !nodes.length || edges === undefined
  ) {
    return (
      <div>
        <h1>No family members in this family</h1>
      </div>
    )
  }

  return (
    <div>
      <Members nodes={nodes} edges={edges} />
    </div>
  )
}
