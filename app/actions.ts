import { SupabaseClient } from "@supabase/supabase-js"

export async function fetchFamilyTree(
  client: SupabaseClient,
  familyId: number
) {
  const fetchMembers = client
    .from("family_members")
    .select()
    .eq("family_id", familyId)
  const fetchRelationships =  client
    .from("family_member_relationships")
    .select()
    .eq("family_id", familyId)

  const [{ data: familyMembers }, { data: familyRelationships }] = await Promise.all([fetchMembers, fetchRelationships])
  return { familyMembers, familyRelationships }
}
