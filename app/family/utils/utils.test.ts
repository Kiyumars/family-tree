import { describe } from "node:test"
import { expect, test } from "vitest"
import { setHierarchies } from "./utils"
import { Relationship } from "../components/Members"
import { createMembers } from "../../../stories/util"

describe("actions add level", () => {
  test("should return zero for standalone line", () => {
    const members = createMembers([
      { first_name: "Grand", second_name: "Parent" },
    ])
    const edges: Relationship[] = []
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
  })
  test("should return zero for two standalone line", () => {
    const members = createMembers([
      { first_name: "Grand", second_name: "Parent" },
      { first_name: "Grand", second_name: "Mother" },
    ])
    const edges: Relationship[] = []
    const hierarchies = setHierarchies(members, edges)
    expect(hierarchies[members[0].id]).toEqual(0)
    expect(hierarchies[members[1].id]).toEqual(0)
  })
  test("should return zero for two couples", () => {
    const members = createMembers([
      { first_name: "Grand", second_name: "Parent" },
      { first_name: "Grand", second_name: "Mother" },
    ])
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
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
    ])
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
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
    ])
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
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
      { first_name: "Partner", second_name: "Partner" },
    ])
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
    const members = createMembers([
      { first_name: "Father", second_name: "Parent" },
      { first_name: "Mother", second_name: "Parent" },
      { first_name: "Child", second_name: "Child" },
      { first_name: "Partner", second_name: "Partner" },
      { first_name: "Child", second_name: "ofChild" },
    ])
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
