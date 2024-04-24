import { createClient, getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function TreePage({ params }: { params: { id: string } }) {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  const client = createClient()
  const { data: familyMembers } = await client
    .from("family_members")
    .select()
    .eq("family_id", params.id)

  if (!familyMembers || !familyMembers.length) {
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
          return <li>{JSON.stringify(member)}</li>
        })}
      </ul>
    </div>
  )
}
