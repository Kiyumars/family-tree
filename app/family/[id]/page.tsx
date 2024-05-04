import { checkFamily, fetchTreeData } from "../../actions"
import { createClient, getSSRUser } from "@/utils/supabase/server"
import { normalizeTree } from "../utils/utils"
import { redirect } from "next/navigation"
import Members from "../components/Members"

export default async function TreePage({ params }: { params: { id: number } }) {
  const user = await getSSRUser()
  if (!user) {
    redirect("/")
  }
  const client = createClient()
  const { membersRes, relationshipsRes } = await fetchTreeData(
    client,
    params.id
  )

  if (!membersRes.data?.length) {
    return (
      <div>
        <h1>Create your family tree!</h1>
      </div>
    )
  }

  const { nodes, edges } = normalizeTree(membersRes.data, relationshipsRes.data)

  return (
    <div>
      <Members nodes={nodes} edges={edges} />
    </div>
  )
}
