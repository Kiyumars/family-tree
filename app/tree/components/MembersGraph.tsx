"use client"

import { FamilyMember, Relationship, RelationshipType } from "@/common.types"
import * as React from "react"
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper"
import { DataSet } from "vis-data"
import { FullItem } from "vis-data/declarations/data-interface"
import MemberModal from "./MemberModal"

interface Props {
  familyId: number
  familyMembers: FamilyMember[]
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
  familyMembers
}: Props) {
  const getRelationship = (id: number) => {
    return relationshipTypes[id]
  }
  const fmSet = new DataSet(familyMembers)
  const rSet = new DataSet(relationships)
  const getFamilyMember = (id: number) => {
    return fmSet.get(id)
  }

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
          getRelationship={getRelationship}
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
            if (event.nodes.length === 1) {
              const selectedNode = fmSet.get(
                event.nodes[0]
              ) as unknown as FullItem<FamilyMember, "id">
              if (selectedNode) {
                const connectedRelationships = rSet.get(event.edges)
                setSelected({
                  node: selectedNode,
                  relationships: connectedRelationships,
                })
              }
            }
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
