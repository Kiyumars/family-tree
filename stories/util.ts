import { FamilyMember, RelationshipType } from "@/common.types"

interface FakeMember {
  first_name: string
  second_name: string
}

export const fakeMember: FamilyMember = {
  id: 1,
  created_at: "2024-05-01",
  family_id: 1,
  uuid: "asdadasdasd",
  birth_date: "1769-08-15",
  death_date: "1821-05-05",
  first_name: "Napoleon",
  second_name: "Bonaparte",
  profession: "Warmongering emperor",
  biography:
    "Short king impresses an Austrian socialite by taking over Europe.",
  gender: "male",
}

export function createMembers(
  members: FakeMember[]
): FamilyMember[] {
  return members.map((m, i) => {
    return {
      id: i + 1,
      uuid: (Math.random() + 1).toString(36).substring(7),
      family_id: i,
      birth_date: Date(),
      first_name: m.first_name,
      second_name: m.second_name,
      biography: null,
      created_at: Date(),
      profession: null,
      death_date: null,
      gender: "m",    }
  })
}

export function fakeGetRelationship(id: number) {
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
