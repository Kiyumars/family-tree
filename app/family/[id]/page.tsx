import { fetchFamilyTree } from "@/app/actions"
import { createClient, getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function TreePage({ params }: { params: { id: number } }) {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  const client = createClient()
  const { familyMembers, familyRelationships } = await fetchFamilyTree(
    client,
    params.id
  )

  if (
    !familyMembers ||
    !familyMembers.length ||
    !familyRelationships ||
    !familyRelationships?.length
  ) {
    return (
      <div>
        <h1>No family members in this family</h1>
      </div>
    )
  }

  return (
    <div>
      <ul>
        {familyMembers.map((member) => {
          return <li key={member.uuid}>{JSON.stringify(member)}</li>
        })}
      </ul>
    </div>
  )
}
