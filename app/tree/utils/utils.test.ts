import { RelationshipType, Relationship } from "@/common.types"
import { describe } from "node:test"
import { expect, test } from "vitest"
import { createMembers } from "../../../stories/util"
import {
  Adjacencies,
  createAdjaciencies,
  mapAdjencies,
  setHierarchies,
} from "./utils"
import RelationshipTypeIds, { rtMap } from "../components/RelationshipTypes"

describe("actions add level", () => {
  test("should return zero for standalone line", () => {
    const adjMap: Record<number, Adjacencies> = { 1: createAdjaciencies({}) }
    const members = createMembers([
      { first_name: "Single", second_name: "Person" },
    ])
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
  })
  test("should return zero for two standalone line", () => {
    const adjMap: Record<number, Adjacencies> = {
      1: createAdjaciencies({}),
      2: createAdjaciencies({}),
    }

    const members = createMembers([
      { first_name: "Single", second_name: "Man" },
      { first_name: "Single", second_name: "Woman" },
    ])
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return zero for two couples", () => {
    const adjMap: Record<number, Adjacencies> = {
      1: createAdjaciencies({ partners: [2] }),
      2: createAdjaciencies({ partners: [1] }),
    }
    const members = createMembers([
      { first_name: "Husband", second_name: "Man" },
      { first_name: "Wife", second_name: "Woman" },
    ])
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return one and zero for parent/child", () => {
    const adjMap = {
      1: createAdjaciencies({ children: [2] }),
      2: createAdjaciencies({ parents: [1] }),
    }
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
    ])
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(1)
  })
  test("should return two zeroes and one one for parent couple and child", () => {
    const adjMap = {
      1: createAdjaciencies({ partners: [2], children: [3] }),
      2: createAdjaciencies({ partners: [1], children: [3] }),
      3: createAdjaciencies({ parents: [1, 2] }),
    }
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
    ])
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
  })
  test("should return correct for one nuclear family and partner of child", () => {
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
      { first_name: "Partner", second_name: "Partner" },
    ])
    const adjMap = {
      1: createAdjaciencies({ partners: [2], children: [3] }),
      2: createAdjaciencies({ partners: [1], children: [3] }),
      3: createAdjaciencies({ parents: [1, 2], partners: [4] }),
      4: createAdjaciencies({ partners: [3] }),
    }
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
    expect(hierarchies[members[3].id]).toEqual(1)
  })
  test("should return correct for one nuclear family and partner of child, and own child", () => {
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
      { first_name: "Partner", second_name: "Partner" },
      { first_name: "Child", second_name: "ofChild" },
    ])
    const adjMap = {
      1: createAdjaciencies({ partners: [2], children: [3] }),
      2: createAdjaciencies({ partners: [1], children: [3] }),
      3: createAdjaciencies({ parents: [1, 2], partners: [4], children: [5] }),
      4: createAdjaciencies({ partners: [3], children: [5] }),
      5: createAdjaciencies({ parents: [3, 4] }),
    }
    const hierarchies = setHierarchies(members, adjMap)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
    expect(hierarchies[members[3].id]).toEqual(1)
    expect(hierarchies[members[4].id]).toEqual(2)
  })
})

describe("util mapAdjacencies", () => {
  test("should return empty adjacencies", () => {
    const members = createMembers([
      { first_name: "Single", second_name: "Person" },
    ])
    const relationships: Relationship[] = []
    const adjMap = mapAdjencies(members, relationships)
    expect(adjMap[1].children.size).toBe(0)
    expect(adjMap[1].parents.size).toBe(0)
    expect(adjMap[1].partners.size).toBe(0)
  })
  test("should return partnership", () => {
    const members = createMembers([
      { first_name: "Man", second_name: "Couple" },
      { first_name: "Woman", second_name: "Couple" },
    ])
    const relationships: Relationship[] = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 2,
        relationship_type: RelationshipTypeIds.Partner.Married,
      },
      {
        id: 1,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: RelationshipTypeIds.Partner.Married,
      },
    ]
    const adjMap = mapAdjencies(members, relationships)
    expect(adjMap[1].children.size).toBe(0)
    expect(adjMap[1].parents.size).toBe(0)
    expect(adjMap[1].partners.size).toBe(1)
    expect(adjMap[2].partners.size).toBe(1)
  })
  test("should return family with one child", () => {
    const members = createMembers([
      { first_name: "Man", second_name: "Couple" },
      { first_name: "Woman", second_name: "Couple" },
      { first_name: "Child", second_name: "Couple" },
    ])
    const relationships: Relationship[] = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 2,
        relationship_type: RelationshipTypeIds.Partner.Married,
      },
      {
        id: 1,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: RelationshipTypeIds.Partner.Married,
      },
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 3,
        relationship_type: RelationshipTypeIds.Parent.Biological,
      },
      {
        id: 1,
        family_id: 1,
        from: 3,
        to: 1,
        relationship_type: RelationshipTypeIds.Child.Biological,
      },
      {
        id: 1,
        family_id: 1,
        from: 2,
        to: 3,
        relationship_type: RelationshipTypeIds.Parent.Biological,
      },
      {
        id: 1,
        family_id: 1,
        from: 3,
        to: 2,
        relationship_type: RelationshipTypeIds.Child.Biological,
      },
    ]
    const adjMap = mapAdjencies(members, relationships)
    expect(adjMap[1].children.size).toBe(1)
    expect(adjMap[1].parents.size).toBe(0)
    expect(adjMap[1].partners.size).toBe(1)
    expect(adjMap[2].children.size).toBe(1)
    expect(adjMap[2].parents.size).toBe(0)
    expect(adjMap[2].partners.size).toBe(1)
    expect(adjMap[3].children.size).toBe(0)
    expect(adjMap[3].parents.size).toBe(2)
    expect(adjMap[3].partners.size).toBe(0)
  })
})
