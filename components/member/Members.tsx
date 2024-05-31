import { FamilyMember, Relationship } from "@/common.types"
import {
  mapAdjencies,
  mapFamilyMembers,
  setHierarchies,
} from "../../app/tree/utils/utils"
import MembersGraph from "./MembersGraph"

interface Props {
  familyId: number
  familyMembers: FamilyMember[]
  relationships: Relationship[]
}

export default function Members({
  familyId,
  familyMembers,
  relationships,
}: Props) {
  if (!familyMembers.length) {
    return (
      <div>
        <h1>Create your family tree!</h1>
      </div>
    )
  }

  const fmMap = mapFamilyMembers(familyMembers)
  const adjMap = mapAdjencies(familyMembers, relationships)
  const hierarchies = setHierarchies(familyMembers, adjMap)
  const nodes = familyMembers.map((member) => {
    return {
      id: member.id,
      label: `${member.first_name} ${member.second_name}`,
      level: hierarchies[member.id],
    }
  })
  const edges = [...relationships]
  return (
    <MembersGraph
      familyId={familyId}
      familyMembers={fmMap}
      nodes={nodes}
      edges={edges}
      adjacenciesMap={adjMap}
    />
  )
}
