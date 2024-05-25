import {
  FamilyMember,
  Relationship,
  RelationshipType,
  RelationshipUpsert,
} from "@/common.types"
import RelationshipTypeIds, { rtMap } from "../components/RelationshipTypes"

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
  relationships: Relationship[]
) {
  const adjMap: Record<number, Adjacencies> = {}
  familyMembers.forEach((fm) => {
    adjMap[fm.id] = createAdjaciencies({})
  })
  relationships.forEach(({ from, to, relationship_type }) => {
    switch (rtMap[relationship_type].type) {
      case "parent":
        adjMap[from].children.add(to)
        break
      case "child":
        adjMap[from].parents.add(to)
        break
      case "partner":
        adjMap[from].partners.add(to)
        break
    }
  })
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
  props.parents?.forEach((b) => adjencies.parents.add(b))
  props.partners?.forEach((c) => adjencies.partners.add(c))
  return adjencies
}

export const findRecipricol = (id: number) => {
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
    default:
      throw new Error(`could not find reciprical id for ${id}`)
  }
}

export const addRecipricolRelationships = (
  rs: RelationshipUpsert[]
): RelationshipUpsert[] => {
  const ers: RelationshipUpsert[] = [...rs]
  rs.forEach((r) => {
    ers.push({
      family_id: r.family_id,
      from: r.to,
      to: r.from,
      relationship_type: findRecipricol(r.relationship_type),
    })
  })
  return ers
}
