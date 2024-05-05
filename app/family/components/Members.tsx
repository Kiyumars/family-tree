"use client"

import * as React from "react"
import VisGraph from "react-vis-graph-wrapper"

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
  return (
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
          const { nodes, edges } = event
          console.log(nodes, edges)
        },
      }}
      // ref={(network: Network) => {
      //   //  if you want access to vis.js network api you can set the state in a parent component using this property
      //   console.log(network)
      // }}
    />
  )
}

export default Members
