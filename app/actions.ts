import { SupabaseClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"

export interface MemberRecord {
  id: number
  uuid: string
  first_name: string
  second_name: string
}

export interface RelationshipRecord {
  source: number
  target: number
  relationship_types: {
    type: string
    subtype: string
  }
}

export async function fetchTreeData(client: SupabaseClient, familyId: number) {
  const fetchMembers = client
    .from("family_members")
    .select(
      `
    id,
    uuid,
    first_name,
    second_name
    `
    )
    .eq("family_id", familyId)
    .order("birth_date")
  const fetchRelationships = client
    .from("family_member_relationships")
    .select(
      `
   source,
   target,
   relationship_types (type, subtype)
     `
    )
    .eq("family_id", familyId)

  const [membersRes, relationshipsRes] = await Promise.all([
    fetchMembers,
    fetchRelationships,
  ])
  if (membersRes.error) {
    throw new Error(membersRes.error.message)
  }
  if (relationshipsRes.error) {
    throw new Error(relationshipsRes.error.message)
  }
  if (!membersRes.data?.length) {
    const familyExists = await checkFamily(client, familyId)
    if (!familyExists) {
      notFound()
    }
  }

  return { membersRes, relationshipsRes }
}

export async function checkFamily(
  client: SupabaseClient,
  id: number
): Promise<boolean> {
  const res = await client.from("families").select().eq("id", id)
  return res.data != null && res.data.length > 0
}
