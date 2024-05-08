"use server"

import { TablesInsert } from "@/database.types"
import { createClient } from "@/utils/supabase/server"
import { SupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"

import { z } from "zod"

export async function fetchTreeData(familyId: number) {
  const client = createClient()
  const fetchMembers = client
    .from("family_members")
    .select()

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
  const res = await client.from("trees").select().eq("id", id)
  return res.data != null && res.data.length > 0
}

export async function editNode(fd: FormData) {
  const schema = z.object({
    id: z.coerce.number().transform((x) => (x ? x : undefined)),
    family_id: z.coerce.number(),
    first_name: z.string().min(1),
    second_name: z.string().min(1),
    biography: z.string().transform((x) => (x.length ? x : null)),
    birth_date: z.string().date(),
    death_date: z.string().date().optional().or(z.null()),
    gender: z.enum(["m", "w"]),
    profession: z.string().transform((x) => (x.length ? x : null)),
  })
  let node = schema.safeParse({
    id: fd.get("id"),
    family_id: fd.get("family_id"),
    first_name: fd.get("first_name"),
    second_name: fd.get("second_name"),
    biography: fd.get("biography"),
    birth_date: fd.get("birth_date"),
    death_date: fd.get("death_date"),
    gender: fd.get("gender"),
    profession: fd.get("profession"),
  })
  if (!node.success) {
    throw node.error
  }
  return await upsert(node.data)
}

async function upsert(node: TablesInsert<"family_members">) {
  const client = createClient()
  const { data, error } = await client
    .from("family_members")
    .upsert(node)
    .select()
    .limit(1)
    .single()
  if (error != null) throw error
  revalidatePath(`/tree/${node.family_id}`)
  return data
}
