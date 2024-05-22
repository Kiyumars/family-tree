"use client"

import { FamilyMember, Relationship, RelationshipType } from "@/common.types"
import * as React from "react"
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper"
import { DataSet } from "vis-data"
import MemberModal from "./MemberModal"

interface Props {
  familyId: number
  familyMembers: Record<number, FamilyMember>
  nodes: Node[]
  edges: Edge[]
  relationships: Relationship[]
  relationshipTypes: Record<number, RelationshipType>
}

interface SelectedProps {
  node: FamilyMember
  relationships: Relationship[]
}

export function MembersGraph({
  nodes,
  edges,
  familyId,
  relationships,
  relationshipTypes,
  familyMembers,
}: Props) {
  const getRelationshipType = (id: number) => {
    return relationshipTypes[id]
  }
  const getFamilyMember = (id: number) => {
    return familyMembers[id]
  }
  const rSet = new DataSet(relationships)

  const [selected, setSelected] = React.useState<SelectedProps | undefined>(
    undefined
  )
  return (
    <div>
      {selected && (
        <MemberModal
          familyId={familyId}
          node={selected.node}
          edges={selected.relationships}
          getRelationshipType={getRelationshipType}
          getFamilyMember={getFamilyMember}
          onClose={() => setSelected(undefined)}
        />
      )}

      <VisGraph
        graph={{ nodes, edges }}
        options={{
          layout: {
            hierarchical: {
              direction: "UD",
              sortMethod: "directed",
            },
          },
          nodes: {
            fixed: true,
            margin: {
              left: 20,
              right: 20,
            },
          },
          // physics: false,
          edges: {
            color: "#00000",
            chosen: false,
          },
          height: "500px",
        }}
        events={{
          selectNode: (event: any) => {
            const selectedNode = getFamilyMember(event.nodes[0])
            const connectedRelationships = rSet.get(event.edges)
            setSelected({
              node: selectedNode,
              relationships: connectedRelationships,
            })
          },
        }}
        // ref={(network: Network) => {
        //   console.log("🚀 ~ Members ~ network:", network)
        //   //  if you want access to vis.js network api you can set the state in a parent component using this property
        // }}
      />
    </div>
  )
}

export default MembersGraph
