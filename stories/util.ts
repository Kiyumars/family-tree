import { Node } from "@/app/tree/components/MembersGraph"
import { FamilyMember } from "@/common.types"
import { Tables } from "@/database.types"

interface FakeMember {
  first_name: string
  second_name: string
}

export const fakeMember: Node = {
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
  title: "Napoleon Bonaparte",
  label: "Napoleon Bonaparte",
  level: 0,
}

export function createMembers(
  members: FakeMember[]
): FamilyMember[] {
  let results: FamilyMember[] = []
  for (let i = 1; i < members.length + 1; i++) {
    results.push({
      id: i,
      uuid: (Math.random() + 1).toString(36).substring(7),
      family_id: i,
      birth_date: Date(),
      first_name: members[i - 1].first_name,
      second_name: members[i - 1].second_name,
      biography: null,
      created_at: Date(),
      profession: null,
      death_date: null,
      gender: "m",
    })
  }
  return results
}

export function fakeGetRelationship(id: number) {
  const rtMap: Record<number, Tables<"relationship_types">> = {
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
