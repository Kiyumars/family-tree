import { SupabaseClient } from "@supabase/supabase-js"
import { Edge, FamilyMember, Node } from "./family/components/Members"

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

export async function fetchFamilyTree(
  client: SupabaseClient,
  familyId: number
) {
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

  const [{ data: fmd }, { data: frb }] = await Promise.all([
    fetchMembers,
    fetchRelationships,
  ])

  // todo handle errors and new families
  if (!fmd || fmd.length < 1) {
    return { familyMembers: [], familyRelationships: [] }
  }

  const familyMembers = addLevels(fmd, frb as unknown as RelationshipRecord[])

  const familyRelationships: Edge[] = frb?.map((fr) => {
    return {
      from: fr.source as number,
      to: fr.target as number,
    }
  })
  return { familyMembers, familyRelationships }
}

export function addLevels(
  nodes: MemberRecord[],
  edges: RelationshipRecord[]
): Node[] {
  const hash: Record<
    number,
    {
      parents: number[]
      children: number[]
      partners: number[]
      level?: number
    }
  > = {}
  for (let i = 0; i < nodes.length; i++) {
    hash[nodes[i].id] = { parents: [], children: [], partners: [] }
  }
  console.log("🚀 ~ hash 1:", hash)
  for (let i = 0; i < edges.length; i++) {
    const { source, target, relationship_types } = edges[i]
    if (relationship_types.type == "parent") {
      hash[source].children.push(target)
    }
    if (relationship_types.type == "child") {
      hash[source].parents.push(target)
    }
    if (relationship_types.type == "partner") {
      hash[source].partners.push(target)
    }
  }

  let stack: [number, number][] = []
  function bfs(id: number, level: number) {
    if (hash[id].level != undefined) {
      return
    }
    hash[id].level = level
    hash[id].children.forEach((child) => stack.push([child, level + 1]))
    hash[id].parents.forEach((parent) => stack.push([parent, level - 1]))
    hash[id].partners.forEach((partner) => stack.push([partner, level]))
  }

  // start with oldest member of family tree
  stack.push([nodes[0].id, 0])
  while (stack && stack.length > 0) {
    for (let i = 0; i < stack.length; i++) {
      const pop = stack.shift()
      if (pop) {
        bfs(pop[0], pop[1])
      }
    }
  }

  return nodes.map((node) => {
    return {
      id: node.id,
      label: `${node.first_name} ${node.second_name}`,
      title: `${node.first_name} ${node.second_name}`,
      level: hash[node.id].level != undefined ? hash[node.id].level : 0,
    }
  })
}
