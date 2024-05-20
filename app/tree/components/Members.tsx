import { FamilyMember, Relationship, RelationshipType } from "@/common.types"
import { setHierarchies } from "../utils/utils"
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

  const rtMap: Record<number, RelationshipType> = {}
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
