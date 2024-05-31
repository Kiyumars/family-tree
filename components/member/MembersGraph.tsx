"use client"

import { FamilyMember } from "@/types/common.types"
import * as React from "react"
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper"
import { Adjacencies } from "@/utils/helpers/tree"
import MemberModal from "./MemberModal"

interface Props {
  familyId: number
  familyMembers: Record<number, FamilyMember>
  nodes: Node[]
  edges: Edge[]
  adjacenciesMap: Record<number, Adjacencies>
}

export function MembersGraph({
  adjacenciesMap,
  nodes,
  edges,
  familyId,
  familyMembers,
}: Props) {
  const getRelationships = (id: number) => {
    return adjacenciesMap[id]
  }
  const getFamilyMember = (id: number) => {
    return familyMembers[id]
  }
  const [selected, setSelected] = React.useState<FamilyMember | undefined>(
    undefined
  )
  return (
    <div>
      {selected && (
        <MemberModal
          familyId={familyId}
          node={selected}
          getRelationships={getRelationships}
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
            setSelected(selectedNode)
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
