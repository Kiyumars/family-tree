import { FamilyMember, Relationship, RelationshipType } from "@/common.types"

export interface Adjacencies {
  partners: Set<number>
  children: Set<number>
  parents: Set<number>
}

export function setHierarchies(
  nodes: FamilyMember[],
  adjMap: Record<number, Adjacencies>
): Record<number, number> {
  const hierarchies: Record<number, number> = {}
  let stack: [number, number][] = []
  function bfs(id: number, level: number) {
    if (hierarchies[id] !== undefined) {
      return
    }
    hierarchies[id] = level
    adjMap[id].children.forEach(
      (child) =>
        hierarchies[child] === undefined && stack.push([child, level + 1])
    )
    adjMap[id].parents.forEach(
      (parent) =>
        hierarchies[parent] === undefined && stack.push([parent, level - 1])
    )
    adjMap[id].partners.forEach(
      (partner) =>
        hierarchies[partner] === undefined && stack.push([partner, level])
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

  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i].id
    const level = hierarchies[id]
    if (level !== undefined) {
      hierarchies[id] = level
    } else {
      hierarchies[id] = 0
    }
  }

  return hierarchies
}

export function mapRelationshipTypes(rts: RelationshipType[]) {
  const m: Record<number, RelationshipType> = {}
  rts.forEach((r) => {
    m[r.id] = r
  })
  return m
}

export function mapAdjencies(
  familyMembers: FamilyMember[],
  relationships: Relationship[],
  relationshipTypes: Record<number, RelationshipType>
) {
  const getRelationship = (id: number) => {
    return relationshipTypes[id]
  }
  const adjMap: Record<number, Adjacencies> = {}
  for (let i = 0; i < familyMembers.length; i++) {
    adjMap[familyMembers[i].id] = createAdjaciencies({})
  }
  for (let i = 0; i < relationships.length; i++) {
    const { from, to, relationship_type } = relationships[i]
    switch (getRelationship(relationship_type).type) {
      case "parent":
        adjMap[from].children.add(to)
      case "child":
        adjMap[from].parents.add(to)
      case "partner":
        adjMap[from].partners.add(to)
    }
  }
  return adjMap
}

export function mapFamilyMembers(familyMembers: FamilyMember[]) {
  const m: Record<number, FamilyMember> = {}
  familyMembers.forEach((fm) => {
    m[fm.id] = fm
  })
  return m
}

export function createAdjaciencies(props: {
  parents?: number[]
  children?: number[]
  partners?: number[]
}) {
  const adjencies: Adjacencies = {
    parents: new Set(),
    children: new Set(),
    partners: new Set(),
  }
  props.children?.forEach((a) => adjencies.children.add(a))
  props.parents?.forEach((a) => adjencies.parents.add(a))
  props.partners?.forEach((a) => adjencies.partners.add(a))
  return adjencies
}