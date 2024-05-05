"use client"

import * as React from "react"
import VisGraph, { Network } from "react-vis-graph-wrapper"
import MemberModal from "./MemberModal"
import { DataSet } from "vis-data"
import { FullItem } from "vis-data/declarations/data-interface"

interface Props {
  nodes: Node[]
  edges: Edge[]
}

export interface FamilyMember {
  uuid: string
  first_name: string
  second_name: string
}

export interface Node {
  id: number
  label: string
  title: string
  level?: number
}

export interface Edge {
  from: number
  to: number
  label: string
}

export function Members({ nodes, edges }: Props) {
  const nodeSet = new DataSet(nodes)
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
              const selectedNode = nodeSet.get(event.nodes[0]) as unknown as FullItem<Node, 'id'>
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
