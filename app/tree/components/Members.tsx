import { FamilyMember, Relationship } from "@/common.types"
import { Edge } from "react-vis-graph-wrapper"
import {
  mapAdjencies,
  mapFamilyMembers,
  mapNodes,
  setHierarchies,
} from "../utils/utils"
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
  const { nodes, memberToNode, nodeToMember } = mapNodes(
    familyMembers,
    fmMap,
    adjMap,
    hierarchies
  )
  const edges: Edge[] = relationships.map((r) => {
    return {
      id: r.id,
      from: memberToNode[r.from],
      to: memberToNode[r.to],
      relationship_type: r.relationship_type,
    }
  })
  return (
    <MembersGraph
      familyId={familyId}
      familyMembers={fmMap}
      nodes={nodes}
      edges={edges}
      adjacenciesMap={adjMap}
      nodeToMember={nodeToMember}
    />
  )
}
