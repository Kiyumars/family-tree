"use server"

import RelationshipTypeIds, {
  rtMap,
} from "@/app/tree/components/RelationshipTypes"
import {
  FamilyMember,
  FamilyMemberUpsert,
  RelationshipUpsert,
} from "@/common.types"
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
    .select()
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

export async function upsertNode(fd: FormData, revalidatedPath?: string) {
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
  const upserted = await upsert(node.data)
  if (revalidatedPath) {
    revalidatePath(revalidatedPath)
  }
  return upserted
}

async function upsert(node: FamilyMemberUpsert) {
  const client = createClient()
  const { data, error } = await client
    .from("family_members")
    .upsert(node)
    .select()
    .limit(1)
    .single()
  if (error != null) throw error
  return data
}

export async function upsertEdges(
  edges: RelationshipUpsert[],
  revalidatedPath?: string
) {
  const client = createClient()
  const { data, error } = await client
    .from("family_member_relationships")
    .upsert(edges)
    .select()
  if (error != null) throw error
  if (revalidatedPath) {
    revalidatePath(revalidatedPath)
  }
  return data
}

export async function upsertRelationship(
  fd: FormData,
  familyId: number,
  familyMembers: FamilyMember[],
  revalidatedPath?: string
) {
  const schema = z.object({
    id: z.coerce.number(),
  })
  const relationship = schema.safeParse({
    id: fd.get("relationship"),
  })
  if (!relationship.success) {
    throw relationship.error
  }
  if (familyMembers.length != 2) {
    throw new Error("parents do not have length 2")
  }
  await upsertEdges(
    [
      {
        family_id: familyId,
        from: familyMembers[0].id,
        to: familyMembers[1].id,
        relationship_type: relationship.data.id,
      },
      {
        family_id: familyId,
        from: familyMembers[1].id,
        to: familyMembers[0].id,
        relationship_type: relationship.data.id,
      },
    ],
    revalidatedPath
  )
}

export async function upsertChildsParents({
  parents,
  childId,
  familyId,
  revalidatedPath,
}: {
  parents: FormDataEntryValue[]
  familyId: number
  childId: number
  revalidatedPath?: string
}) {
  const schema = z.object({
    parents: z.string().array(),
  })
  const parse = schema.safeParse({
    parents: parents,
  })
  if (!parse.success) {
    throw Error("could not parse parents from form")
  }

  let parentEdges: RelationshipUpsert[] = []
  parse.data.parents.forEach((pr) => {
    const [parent, relationship] = pr.split("-")
    const parentId = parseInt(parent, 10)
    const relationshipId = parseInt(relationship, 10)
    if (isNaN(parentId) || isNaN(relationshipId)) {
      throw new Error("either parentId or relationshipId is NaN")
    }
    parentEdges.push({
      family_id: familyId,
      from: childId,
      to: parentId,
      relationship_type:
        relationshipId === RelationshipTypeIds.Parent.Adopted
          ? RelationshipTypeIds.Child.Adopted
          : RelationshipTypeIds.Child.Biological,
    })
    parentEdges.push({
      family_id: familyId,
      from: parentId,
      to: childId,
      relationship_type: relationshipId,
    })
  })
  await upsertEdges(parentEdges, revalidatedPath)

  return parse.data.parents
}

export async function upsertPartnerRelationships({
  fd,
  partners,
  familyId,
  revalidatedPath,
}: {
  fd: FormData
  partners: [number, number]
  familyId: number
  revalidatedPath?: string
}) {
  const schema = z.object({
    relationship: z.coerce.number(),
  })
  const parse = schema.safeParse({
    relationship: fd.get("relationship"),
  })
  if (!parse.success) {
    throw Error("could not parse relationship from form")
  }
  const relationships = [
    {
      family_id: familyId,
      from: partners[0],
      to: partners[1],
      relationship_type: parse.data.relationship,
    },
    {
      family_id: familyId,
      from: partners[1],
      to: partners[0],
      relationship_type: parse.data.relationship,
    },
  ]
  await upsertEdges(relationships, revalidatedPath)
}

/**
 *  upserts bidirectional relationships
 */
export async function upsertBDrelationships({
  familyId,
  fd,
  from,
  to,
}: {
  familyId: number
  fd: FormData
  from: number
  to: number
}) {
  const schema = z.object({
    relationship: z.coerce.number(),
  })
  const parse = schema.safeParse({
    relationship: fd.get("relationship"),
  })
  if (!parse.success) {
    throw Error("could not parse relationship from form")
  }
  const findRecipricol = (id: number) => {
    const rt = rtMap[id]
    switch (rt.type) {
      case "partner":
        return rt.id
      case "parent":
        if (rt.subtype === "adopted") {
          return RelationshipTypeIds.Child.Adopted
        }
        return RelationshipTypeIds.Child.Biological
      case "child":
        if (rt.subtype === "adopted") {
          return RelationshipTypeIds.Parent.Adopted
        }
        return RelationshipTypeIds.Parent.Biological
    }
  }
  const rr = findRecipricol(parse.data.relationship)
  if (!rr) {
    throw new Error("could not find reciprical relationship")
  }

  const edges: RelationshipUpsert[] = [
    {
      family_id: familyId,
      from: from,
      to: to,
      relationship_type: parse.data.relationship,
    },
    {
      family_id: familyId,
      from: to,
      to: from,
      relationship_type: rr,
    },
  ]
  await upsertEdges(edges)
}
