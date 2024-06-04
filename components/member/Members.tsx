import { FamilyMember, Relationship } from "@/types/common.types"
import {
  mapAdjencies,
  mapFamilyMembers,
  setHierarchies,
} from "@/utils/helpers/tree"
import MembersGraph, { EmptyGraph } from "./MembersGraph"

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
    return <EmptyGraph familyId={familyId} />
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
