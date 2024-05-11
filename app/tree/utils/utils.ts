import { Tables } from "@/database.types"

type Hash = Record<
  number,
  {
    parents: number[]
    children: number[]
    partners: number[]
    level?: number
  }
>

export function setHierarchies(
  nodes: Tables<"family_members">[],
  edges: Tables<"family_member_relationships">[],
  getRelationship: (id: number) => Tables<'relationship_types'>
): Record<number, number> {
  const hash: Hash = {}
  for (let i = 0; i < nodes.length; i++) {
    hash[nodes[i].id] = { parents: [], children: [], partners: [] }
  }
  for (let i = 0; i < edges.length; i++) {
    const { from, to, relationship_type } = edges[i]
    switch(getRelationship(relationship_type).type) {
      case "parent":
        hash[from].children.push(to)
      case "child":
        hash[from].parents.push(to)
      case "partner":
        hash[from].partners.push(to)
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

  const hierarchies: Record<number, number> = {}
  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i].id
    const level = hash[id]?.level
    if (level !== undefined) {
      hierarchies[id] = level
    } else {
      hierarchies[id] = 0
    }
  }

  return hierarchies
}
