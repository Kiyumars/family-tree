"use client"

import * as React from "react"
import VisGraph, { Network } from "react-vis-graph-wrapper"
import MemberModal from "./MemberModal"
import { DataSet } from "vis-data"
import { FullItem } from "vis-data/declarations/data-interface"
import { setHierarchies } from "../utils/utils"

interface Props {
  members: FamilyMember[]
  relationships: Relationship[]
}

export interface FamilyMember {
  id: number
  uuid: string
  family_id: number
  first_name: string
  second_name: string
  birth_date: string
  gender?: string
  biography?: string
  profession?: string
  death_date?: Date
}

export interface RelationshipType {
  type: string
  subtype: string
}

export interface Relationship {
  source: number
  target: number
  relationship_types: RelationshipType
}

export interface Node {
  id: number
  label: string
  title: string
  level?: number
}

export function Members({ members, relationships }: Props) {
  const hierarchies = setHierarchies(members, relationships)
  const nodes = members.map((member) => {
    return {
      title: `${member.first_name} ${member.second_name}`,
      label: `${member.first_name} ${member.second_name}`,
      level: hierarchies[member.id],
      ...member,
    }
  })
  const nodeSet = new DataSet(nodes)

  const edges = relationships.map((r) => {
    return {
      from: r.source,
      to: r.target,
      // label: r.relationship_types.type,
    }
  })
  const [selected, setSelected] = React.useState<
    FullItem<Node, "id"> | undefined
  >(undefined)
  return (
    <div>
      {selected && (
        <MemberModal node={selected} onClose={() => setSelected(undefined)} />
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
                setSelected(selectedNode)
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
