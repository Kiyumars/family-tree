import { MemberRecord, RelationshipRecord } from "@/app/actions"
import { Edge, Node } from "../components/Members"

export function normalizeTree(
  members: {
    id: any
    uuid: any
    first_name: any
    second_name: any
  }[],
  relationships: {
    source: any
    target: any
    relationship_types: {
      type: any
      subtype: any
    }[]
  }[]
) {
  const familyMembers = addHierarchies(
    members,
    relationships as unknown as RelationshipRecord[]
  )

  const familyRelationships: Edge[] = relationships?.map((fr) => {
    return {
      from: fr.source as number,
      to: fr.target as number,
      // todo fix ts type error
      // label: fr.relationship_types.type
      label: "",
    }
  })
  return { nodes: familyMembers, edges: familyRelationships }
}

export function addHierarchies(
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
    hash[id].children.forEach(
      (child) =>
        hash[child].level === undefined && stack.push([child, level + 1])
    )
    hash[id].parents.forEach(
      (parent) =>
        hash[parent].level === undefined && stack.push([parent, level - 1])
    )
    hash[id].partners.forEach(
      (partner) =>
        hash[partner].level === undefined && stack.push([partner, level])
    )
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
