"use client"

import { Tables } from "@/database.types"
import * as React from "react"
import VisGraph from "react-vis-graph-wrapper"
import { DataSet } from "vis-data"
import { FullItem } from "vis-data/declarations/data-interface"
import MemberModal from "./MemberModal"

interface Props {
  familyId: number
  nodes: Tables<"family_members">[]
  edges: Tables<"family_member_relationships">[]
  relationshipTypes: Record<number, Tables<"relationship_types">>
}

interface SelectedProps {
  node: Tables<"family_members">
  relationships: Tables<"family_member_relationships">[]
}

export type Node = Tables<"family_members"> & {
  label: string
  title: string
  level: number
}

export function MembersGraph({
  nodes,
  edges,
  familyId,
  relationshipTypes,
}: Props) {
  const getRelationship = (id: number) => {
    return relationshipTypes[id]
  }
  const nodeSet = new DataSet(nodes)
  const edgeSet = new DataSet(edges)

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
          },
          height: "500px",
        }}
        events={{
          select: (event: any) => {
            if (event.nodes.length === 1) {
              const selectedNode = nodeSet.get(
                event.nodes[0]
              ) as unknown as FullItem<Node, "id">
              if (selectedNode) {
                const connectedEdges = edgeSet.get(event.edges)
                setSelected({
                  node: selectedNode,
                  relationships: connectedEdges,
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
