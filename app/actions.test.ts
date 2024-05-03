import { describe } from "node:test"
import { expect, test } from "vitest"
import {
  addLevels,
  MemberRecord,
  RelationshipRecord
} from "./actions"

describe("actions add level", () => {
  test("should return zero for standalone line", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Grand", second_name: "Parent" },
    ]
    const edges: RelationshipRecord[] = []
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
  })
  test("should return zero for two standalone line", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Grand", second_name: "Parent" },
      { id: 2, uuid: "cxzxczx", first_name: "Grand", second_name: "Mother" },
    ]
    const edges: RelationshipRecord[] = []
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
    expect(res[1].level).toEqual(0)
  })
  test("should return zero for two couples", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Grand", second_name: "Parent" },
      { id: 2, uuid: "cxzxczx", first_name: "Grand", second_name: "Mother" },
    ]
    const edges: RelationshipRecord[] = [
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
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
    expect(res[1].level).toEqual(0)
  })
  test("should return one and zero for parent/child", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, uuid: "cxzxczx", first_name: "Child", second_name: "Child" },
    ]
    const edges: RelationshipRecord[] = [
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
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
    expect(res[1].level).toEqual(1)
  })
  test("should return two zeroes and one one for parent couple and child", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, uuid: "cxzxczx", first_name: "Mother", second_name: "Mother" },
      { id: 3, uuid: "vvvvvcc", first_name: "Child", second_name: "Child" },
    ]
    const edges: RelationshipRecord[] = [
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
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
    expect(res[1].level).toEqual(0)
    expect(res[2].level).toEqual(1)
  })
  test("should return correct for one nuclear family and partner of child", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, uuid: "cxzxczx", first_name: "Mother", second_name: "Mother" },
      { id: 3, uuid: "vvvvvcc", first_name: "Child", second_name: "Child" },
      { id: 4, uuid: "fsdffdsf", first_name: "Partner", second_name: "Of Child" },

    ]
    const edges: RelationshipRecord[] = [
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
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
    expect(res[1].level).toEqual(0)
    expect(res[2].level).toEqual(1)
    expect(res[3].level).toEqual(1)
  })
  test("should return correct for one nuclear family and partner of child, and own child", () => {
    const members: MemberRecord[] = [
      { id: 1, uuid: "sdfsdfs", first_name: "Father", second_name: "Father" },
      { id: 2, uuid: "cxzxczx", first_name: "Mother", second_name: "Mother" },
      { id: 3, uuid: "vvvvvcc", first_name: "Child", second_name: "Child" },
      { id: 4, uuid: "fsdffdsf", first_name: "Partner", second_name: "Of Child" },
      { id: 5, uuid: "gggsdfdsd", first_name: "Child", second_name: "Of Child" },


    ]
    const edges: RelationshipRecord[] = [
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
    const res = addLevels(members, edges)
    expect(res[0].level).toEqual(0)
    expect(res[1].level).toEqual(0)
    expect(res[2].level).toEqual(1)
    expect(res[3].level).toEqual(1)
    expect(res[4].level).toEqual(2)
  })
})
