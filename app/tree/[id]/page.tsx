import { getSSRUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { fetchTreeData } from "../../actions"
import Members, { Relationship } from "../components/Members"

export default async function TreePage({ params }: { params: { id: number } }) {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  const { membersRes, relationshipsRes } = await fetchTreeData(params.id)

  if (!membersRes.data?.length) {
    return (
      <div>
        <h1>Create your family tree!</h1>
      </div>
    )
  }

  return (
    <div>
      <Members
        members={membersRes.data}
        // ts does not understand that relationship_type can not be null
        relationships={relationshipsRes.data as unknown as Relationship[]}
      />
    </div>
  )
}
