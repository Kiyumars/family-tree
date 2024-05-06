import { Tables } from "@/database.types"

interface FakeMember {
    first_name: string
    second_name: string
  }
  
  export function createMembers(
    members: FakeMember[]
  ): Tables<"family_members">[] {
    let results: Tables<"family_members">[] = []
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
  