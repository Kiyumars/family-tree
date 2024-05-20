import { RelationshipType } from "@/common.types"
import { describe } from "node:test"
import { expect, test } from "vitest"
import { createMembers } from "../../../stories/util"
import { setHierarchies } from "./utils"


function getRelationship(id: number)  {
  const rtMap: Record<number, RelationshipType> = {
    1: { id: 1, type: "partner", subtype: "married" },
    2: { id: 2, type: "partner", subtype: "unmarried" },
    3: { id: 3, type: "child", subtype: "biological" },
    4: { id: 4, type: "child", subtype: "adopted" },
    5: { id: 5, type: "partner", subtype: "separated" },
    6: { id: 6, type: "parent", subtype: "biological" },
    7: { id: 7, type: "parent", subtype: "adopted" },
  }
  return rtMap[id]
}

describe("actions add level", () => {
  test("should return zero for standalone line", () => {
    const members = createMembers([
      { first_name: "Grand", second_name: "Parent" },
    ])
    const hierarchies = setHierarchies(members, [], getRelationship )
    expect(hierarchies[members[0].id]).toEqual(0)
  })
  test("should return zero for two standalone line", () => {
    const members = createMembers([
      { first_name: "Grand", second_name: "Parent" },
      { first_name: "Grand", second_name: "Mother" },
    ])
    const hierarchies = setHierarchies(members, [], getRelationship)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return zero for two couples", () => {
    const members = createMembers([
      { first_name: "Grand", second_name: "Parent" },
      { first_name: "Grand", second_name: "Mother" },
    ])
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 2,
        relationship_type: 1,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: 1,
      },
    ]
    const hierarchies = setHierarchies(members, edges, getRelationship)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return one and zero for parent/child", () => {
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
    ])
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 2,
        relationship_type: 6,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 1,
        relationship_type: 3,
      },
    ]
    const hierarchies = setHierarchies(members, edges, getRelationship)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(1)
  })
  test("should return two zeroes and one one for parent couple and child", () => {
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
    ])
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 3,
        relationship_type: 6,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 3,
        relationship_type: 6,
      },
      {
        id: 3,
        family_id: 1,
        from: 3,
        to: 1,
        relationship_type: 3,
      },
      {
        id: 4,
        family_id: 1,
        from: 3,
        to: 2,
        relationship_type: 3,
      },
    ]
    const hierarchies = setHierarchies(members, edges, getRelationship)
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
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 3,
        relationship_type: 6,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 3,
        relationship_type:6,
      },
      {
        id: 3,
        family_id: 1,
        from: 3,
        to: 1,
        relationship_type: 3,
      },
      {
        id: 4,
        family_id: 1,
        from: 3,
        to: 2,
        relationship_type: 3,
      },
      {
        id: 5,
        family_id: 1,
        from: 3,
        to: 4,
        relationship_type:1,
      },
      {
        id: 6,
        family_id: 1,
        from: 4,
        to: 3,
        relationship_type:1,
      },
    ]
    const hierarchies = setHierarchies(members, edges, getRelationship)
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
    const edges = [
      {
        id: 1,
        family_id: 1,
        from: 1,
        to: 3,
        relationship_type:6,
      },
      {
        id: 2,
        family_id: 1,
        from: 2,
        to: 3,
        relationship_type: 6,
      },
      {
        id: 3,
        family_id: 1,
        from: 3,
        to: 1,
        relationship_type: 3,
      },
      {
        id: 4,
        family_id: 1,
        from: 3,
        to: 2,
        relationship_type: 3,
      },
      {
        id: 5,
        family_id: 1,
        from: 3,
        to: 4,
        relationship_type:1,
      },
      {
        id: 6,
        family_id: 1,
        from: 4,
        to: 3,
        relationship_type:1,
      },
      {
        id: 7,
        family_id: 1,
        from: 3,
        to: 5,
        relationship_type: 6,
      },
      {
        id: 8,
        family_id: 1,
        from: 4,
        to: 5,
        relationship_type:6,
      },
      {
        id: 9,
        family_id: 1,
        from: 5,
        to: 3,
        relationship_type: 3,
      },
      {
        id: 10,
        family_id: 1,
        from: 5,
        to: 4,
        relationship_type: 3,
      },
    ]
    const hierarchies = setHierarchies(members, edges, getRelationship)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
    expect(hierarchies[members[3].id]).toEqual(1)
    expect(hierarchies[members[4].id]).toEqual(2)
  })
})
