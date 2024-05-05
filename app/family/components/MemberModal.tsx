"use client"

import * as React from "react"
import ModalWrapper from "./ModalWrapper"
import { Node } from "./Members"
import { node } from "prop-types"
import { FullItem } from "vis-data/declarations/data-interface"

export default function MemberModal({ onClose, node }: { onClose: () => void, node: FullItem<Node, 'id'> }) {
  return (
    <ModalWrapper>
      <div >
        <h1>MemberModal</h1>
        <p>{node.title}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </ModalWrapper>
  )
}
