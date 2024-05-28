"use client"

import { FamilyMember } from "@/common.types"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper"
import { Adjacencies, createUrl } from "../utils/utils"
import MemberModal, { Mode } from "./MemberModal"
import ModalWrapper from "./ModalWrapper"

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
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const getRelationships = (id: number) => {
    return adjacenciesMap[id]
  }
  const getFamilyMember = (id: number) => {
    return familyMembers[id]
  }

  const switchModal = (modalId: number, memberId: number) => {
    replace(
      createUrl({
        baseURL: `/tree/${familyId}`,
        params: [
          { name: "modal", value: modalId.toString() },
          { name: "member", value: memberId.toString() },
        ],
      })
    )
  }

  return (
    <div>
      {searchParams.get("modal") && (
        <ModalWrapper>
          <MemberModal
            familyId={familyId}
            getRelationships={getRelationships}
            getFamilyMember={getFamilyMember}
            onClose={() => replace(`/tree/${familyId}`)}
            switchModal={switchModal}
          />
        </ModalWrapper>
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
            switchModal(Mode.Read, getFamilyMember(event.nodes[0]).id)
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
