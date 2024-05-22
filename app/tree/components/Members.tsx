import { FamilyMember, Relationship, RelationshipType } from "@/common.types"
import {
  mapAdjencies,
  mapRelationshipTypes,
  setHierarchies,
} from "../utils/utils"
import MembersGraph from "./MembersGraph"

interface Props {
  familyId: number
  familyMembers: FamilyMember[]
  relationships: Relationship[]
  relationshipTypes: RelationshipType[]
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

  const rtMap = mapRelationshipTypes(relationshipTypes)
  const adjMap = mapAdjencies(familyMembers, relationships, rtMap)
  const hierarchies = setHierarchies(familyMembers, adjMap)
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
