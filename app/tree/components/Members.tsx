import * as React from "react"
import { Tables } from "@/database.types"
import MembersGraph from "./MembersGraph"
import { setHierarchies } from "../utils/utils"
import { FamilyMember } from "@/common.types"

interface Props {
  familyId: number
  familyMembers: FamilyMember[]
  relationships: Tables<"family_member_relationships">[]
  relationshipTypes: Tables<"relationship_types">[]
}

export default function Members({
  familyId,
  familyMembers,
  relationships,
  relationshipTypes,
}: Props) {
  if (!familyMembers.length) {
    return (
      <div>
        <h1>Create your family tree!</h1>
      </div>
    )
  }

  const rtMap: Record<number, Tables<"relationship_types">> = {}
  relationshipTypes.forEach((rt) => {
    rtMap[rt.id] = rt
  })
  const getRelationship = (id: number) => {
    return rtMap[id]
  }
  const hierarchies = setHierarchies(
    familyMembers,
    relationships,
    getRelationship
  )
  const nodes = familyMembers.map((member) => {
    return {
      label: `${member.first_name} ${member.second_name}`,
      level: hierarchies[member.id],
      ...member,
    }
  })
  return (
    <MembersGraph
      familyId={familyId}
      nodes={nodes}
      edges={relationships}
      relationshipTypes={rtMap}
    />
  )
}
