"use client"

import { Tables } from "@/database.types"
import * as React from "react"
import VisGraph, { Edge } from "react-vis-graph-wrapper"
import { DataSet } from "vis-data"
import { FullItem } from "vis-data/declarations/data-interface"
import { setHierarchies } from "../utils/utils"
import MemberModal from "./MemberModal"

interface Props {
  familyId: number
  members: Tables<"family_members">[]
  relationships: Tables<"family_member_relationships">[]
  relationshipTypes: Tables<"relationship_types">[]
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

export function Members({
  members,
  relationships,
  relationshipTypes,
  familyId,
}: Props) {
  const rtMap: Record<number, Tables<"relationship_types">> = {}
  relationshipTypes.forEach((rt) => {
    rtMap[rt.id] = rt
  })
  const getRelationship = (id: number) => {
    return rtMap[id]
  }
  const hierarchies = setHierarchies(members, relationships, getRelationship)
  const nodes = members.map((member) => {
    return {
      label: `${member.first_name} ${member.second_name}`,
      level: hierarchies[member.id],
      ...member,
    }
  })
  const nodeSet = new DataSet(nodes)
  const edgeSet = new DataSet(relationships)

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
        graph={{ nodes, edges: relationships }}
        options={{
          layout: {
            hierarchical: {
              direction: "UD",
              sortMethod: "directed",
            },
          },
          edges: {
            color: "#000000",
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

export default Members
