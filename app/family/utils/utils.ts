import { FamilyMember, Relationship } from "../components/Members"

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
  nodes: FamilyMember[],
  edges: Relationship[]
): Record<number, number> {
  const hash: Hash = {}
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

  const hierarchies: Record<number, number> = {}
  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i].id
    if (hash[id] != undefined && hash[id].level != undefined) {
      hierarchies[id] = hash[id].level
    } else {
      hierarchies[id] = 0
    }
  }

  return hierarchies
}
