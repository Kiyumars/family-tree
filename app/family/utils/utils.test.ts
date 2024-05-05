import { describe } from "node:test"
import { expect, test } from "vitest"
import { setHierarchies } from "./utils"
import { FamilyMember, Relationship } from "../components/Members"

describe("actions add level", () => {
  test("should return zero for standalone line", () => {
    const members: FamilyMember[] = [
      { id: 1, family_id: 1, birth_date: Date(), uuid: "sdfsdfs", first_name: "Grand", second_name: "Parent" },
    ]
    const edges: Relationship[] = []
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
  })
  test("should return zero for two standalone line", () => {
    const members: FamilyMember[] = [
      { id: 1, family_id: 1, birth_date: Date(),uuid: "sdfsdfs", first_name: "Grand", second_name: "Parent" },
      { id: 2, family_id: 1, birth_date: Date(), uuid: "cxzxczx", first_name: "Grand", second_name: "Mother" },
    ]
    const edges: Relationship[] = []
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return zero for two couples", () => {
    const members: FamilyMember[] = [
      { id: 1, family_id: 1, birth_date: Date(),uuid: "sdfsdfs", first_name: "Grand", second_name: "Parent" },
      { id: 2, family_id: 1, birth_date: Date(),uuid: "cxzxczx", first_name: "Grand", second_name: "Mother" },
    ]
    const edges: Relationship[] = [
      {
        source: 1,
        target: 2,
        relationship_types: { type: "partner", subtype: "married" },
      },
      {
        source: 2,
        target: 1,
        relationship_types: { type: "partner", subtype: "married" },
      },
    ]
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return one and zero for parent/child", () => {
    const members: FamilyMember[] = [
      { id: 1, family_id: 1, birth_date: Date(),uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, family_id: 1, birth_date: Date(),uuid: "cxzxczx", first_name: "Child", second_name: "Child" },
    ]
    const edges: Relationship[] = [
      {
        source: 1,
        target: 2,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 2,
        target: 1,
        relationship_types: { type: "child", subtype: "biological" },
      },
    ]
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(1)
  })
  test("should return two zeroes and one one for parent couple and child", () => {
    const members: FamilyMember[] = [
      { id: 1,family_id: 1, birth_date: Date(), uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, family_id: 1, birth_date: Date(),uuid: "cxzxczx", first_name: "Mother", second_name: "Mother" },
      { id: 3, family_id: 1, birth_date: Date(),uuid: "vvvvvcc", first_name: "Child", second_name: "Child" },
    ]
    const edges: Relationship[] = [
      {
        source: 1,
        target: 3,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 2,
        target: 3,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 3,
        target: 1,
        relationship_types: { type: "child", subtype: "biological" },
      },
      {
        source: 3,
        target: 2,
        relationship_types: { type: "child", subtype: "biological" },
      },
    ]
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
  })
  test("should return correct for one nuclear family and partner of child", () => {
    const members: FamilyMember[] = [
      { id: 1,family_id: 1, birth_date: Date(), uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, family_id: 1, birth_date: Date(),uuid: "cxzxczx", first_name: "Mother", second_name: "Mother" },
      { id: 3, family_id: 1, birth_date: Date(),uuid: "vvvvvcc", first_name: "Child", second_name: "Child" },
      {
        id: 4,family_id: 1, birth_date: Date(),
        uuid: "fsdffdsf",
        first_name: "Partner",
        second_name: "Of Child",
      },
    ]
    const edges: Relationship[] = [
      {
        source: 1,
        target: 3,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 2,
        target: 3,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 3,
        target: 1,
        relationship_types: { type: "child", subtype: "biological" },
      },
      {
        source: 3,
        target: 2,
        relationship_types: { type: "child", subtype: "biological" },
      },
      {
        source: 3,
        target: 4,
        relationship_types: { type: "partner", subtype: "married" },
      },
      {
        source: 4,
        target: 3,
        relationship_types: { type: "partner", subtype: "married" },
      },
    ]
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
    expect(hierarchies[members[3].id]).toEqual(1)
  })
  test("should return correct for one nuclear family and partner of child, and own child", () => {
    const members: FamilyMember[] = [
      { id: 1,family_id: 1, birth_date: Date(), uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, family_id: 1, birth_date: Date(),uuid: "cxzxczx", first_name: "Mother", second_name: "Mother" },
      { id: 3, family_id: 1, birth_date: Date(),uuid: "vvvvvcc", first_name: "Child", second_name: "Child" },
      {
        id: 4,family_id: 1, birth_date: Date(),
        uuid: "fsdffdsf",
        first_name: "Partner",
        second_name: "Of Child",
      },
      {
        id: 5,family_id: 1, birth_date: Date(),
        uuid: "gggsdfdsd",
        first_name: "Child",
        second_name: "Of Child",
      },
    ]
    const edges: Relationship[] = [
      {
        source: 1,
        target: 3,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 2,
        target: 3,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 3,
        target: 1,
        relationship_types: { type: "child", subtype: "biological" },
      },
      {
        source: 3,
        target: 2,
        relationship_types: { type: "child", subtype: "biological" },
      },
      {
        source: 3,
        target: 4,
        relationship_types: { type: "partner", subtype: "married" },
      },
      {
        source: 4,
        target: 3,
        relationship_types: { type: "partner", subtype: "married" },
      },
      {
        source: 3,
        target: 5,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 4,
        target: 5,
        relationship_types: { type: "parent", subtype: "biological" },
      },
      {
        source: 5,
        target: 3,
        relationship_types: { type: "child", subtype: "biological" },
      },
      {
        source: 5,
        target: 4,
        relationship_types: { type: "child", subtype: "biological" },
      },
    ]
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
    expect(hierarchies[members[2].id]).toEqual(1)
    expect(hierarchies[members[3].id]).toEqual(1)
    expect(hierarchies[members[4].id]).toEqual(2)
  })
})
